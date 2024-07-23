const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { log } = require('console');
const router = express.Router();
const pool = require('../dbConfig');
const fs = require('fs');
const path = require('path');
const openai = require('openai');

const baseDirSubmissions = path.resolve('/app/aivaluate/backend/assignmentSubmissions');
const baseDirKeys = path.resolve('/app/aivaluate/backend/assignmentKeys');

router.use(bodyParser.json());
const openaiApiKey = process.env.OPENAI_API_KEY;

router.post('/gpt/completions', async (req, res) => {
    const { prompt } = req.body;
    log(`Received prompt: ${prompt}`);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ response: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Failed to communicate with AI model' });
        }
    }
});

const getSelectedPrompt = async (instructorId) => {
    try {
        const result = await pool.query('SELECT promptText FROM "Prompt" WHERE "instructorId" = $1 AND "isSelected" = true', [instructorId]);
        return result.rows.length > 0 ? result.rows[0].promptText : '';
    } catch (error) {
        console.error('Error fetching selected prompt:', error);
        return '';
    }
};

const getAssignmentRubric = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT criteria FROM "AssignmentRubric" ar JOIN "useRubric" ur ON ar."assignmentRubricId" = ur."assignmentRubricId" WHERE ur."assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].criteria : '';
    } catch (error) {
        console.error('Error fetching assignment rubric:', error);
        return '';
    }
};

const getMaxPoints = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT maxObtainableGrade FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].maxObtainableGrade : 100;
    } catch (error) {
        console.error('Error fetching max points:', error);
        return 100;
    }
};

const getAssignmentKey = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT assignmentKey FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].assignmentKey : '';
    } catch (error) {
        console.error('Error fetching assignment key:', error);
        return '';
    }
};

const processStudentSubmissions = async (studentId, submissions, assistantId, instructorPrompt, assignmentRubric, maxPoints, assignmentKeyPath) => {
    const submissionFileStreams = submissions.map(file => fs.createReadStream(path.resolve(baseDirSubmissions, studentId, file.submissionFile)));
    let submissionVectorStore = await openai.beta.vectorStores.create({
        name: `Student ${studentId} Submissions`,
    });
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(submissionVectorStore.id, submissionFileStreams);
    let assignmentKeyVectorStore = await openai.beta.vectorStores.create({
        name: `Assignment ${studentId} Key`,
    });
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(assignmentKeyVectorStore.id, [fs.createReadStream(assignmentKeyPath)]);
    await openai.beta.assistants.update(assistantId, {
        tool_resources: {
            file_search: {
                vector_store_ids: [submissionVectorStore.id, assignmentKeyVectorStore.id]
            }
        },
    });

    const threadResponse = await axios.post('https://api.openai.com/v1/threads', {}, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    const thread = threadResponse.data;

    const messageContent = `Grade the student assignment using the following rubric: ${assignmentRubric} and the assignment key provided. The maximum points available for this assignment is ${maxPoints}. Additional Instructions: ${instructorPrompt}`;

    const messageResponse = await axios.post(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        role: "user",
        content: messageContent
    }, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    if (!messageResponse.data || messageResponse.status !== 200) {
        throw new Error('Failed to post message to the thread');
    }

    const runResponse = await axios.post(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        assistant_id: assistantId,
    }, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    let response = await axios.get(`https://api.openai.com/v1/threads/${thread.id}/runs/${runResponse.data.id}`, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    while (response.data.status === "in_progress" || response.data.status === "queued") {
        console.log("Waiting for assistant's response...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        response = await axios.get(`https://api.openai.com/v1/threads/${thread.id}/runs/${runResponse.data.id}`, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });
    }

    const threadMessagesResponse = await axios.get(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    const messages = threadMessagesResponse.data.data;
    const latestAssistantMessage = messages.filter(message => message.role === 'assistant').pop();
    return latestAssistantMessage ? JSON.parse(latestAssistantMessage.content) : null;
};

const processSubmissions = async (assignmentId, instructorId, courseId) => {
    try {
        const submissions = await pool.query(
            'SELECT * FROM "AssignmentSubmission" WHERE "assignmentId" = $1 AND "isSubmitted" = true',
            [assignmentId]
        );

        if (submissions.rows.length === 0) {
            return { status: 404, message: 'No submissions found for this assignment.' };
        }

        const selectedPrompt = await getSelectedPrompt(instructorId);
        const assignmentRubric = await getAssignmentRubric(assignmentId);
        const maxPoints = await getMaxPoints(assignmentId);

        const assignmentKeyResult = await getAssignmentKey(assignmentId);

        if (!assignmentKeyResult) {
            return { status: 404, message: 'Assignment key not found.' };
        }

        const assignmentKeyPath = path.resolve(baseDirKeys, instructorId, courseId, assignmentId, assignmentKeyResult);

        const assistantResponse = await openai.beta.assistants.create({
            name: "AIValuate Grading Assistant",
            instructions: 'You are a web development expert. Your task is to grade student assignments based on the provided rubric and additional instructions. Provide constructive feedback for each submission, and a grade based on the maximum points available.',
            model: "gpt-4o",
            tools: [{ type: "code_interpreter" }, { type: "file_search" }]
        });

        const assistant = assistantResponse.data;
        const assistantId = assistant.id;
        const studentSubmissions = submissions.rows.reduce((acc, submission) => {
            if (!acc[submission.studentId]) {
                acc[submission.studentId] = [];
            }
            acc[submission.studentId].push(submission);
            return acc;
        }, {});

        for (const studentId in studentSubmissions) {
            const aiResponse = await processStudentSubmissions(studentId, studentSubmissions[studentId], assistantId, selectedPrompt, assignmentRubric, maxPoints, assignmentKeyPath);

            if (aiResponse) {
                const grade = aiResponse.grade;
                const feedback = aiResponse.feedback;

                await pool.query(
                    'INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "AIassignedGrade") VALUES ($1, $2, $3) ON CONFLICT ("assignmentSubmissionId", "assignmentId") DO UPDATE SET "AIassignedGrade" = EXCLUDED."AIassignedGrade"',
                    [studentSubmissions[studentId][0].assignmentSubmissionId, assignmentId, grade]
                );

                await pool.query(
                    'INSERT INTO "StudentFeedback" ("studentId", "assignmentId", "courseId", "AIFeedbackText") VALUES ($1, $2, $3, $4) ON CONFLICT ("studentId", "assignmentId") DO UPDATE SET "AIFeedbackText" = EXCLUDED."AIFeedbackText"',
                    [studentId, assignmentId, studentSubmissions[studentId][0].courseId, feedback]
                );
            }
        }

        return { status: 200, message: 'Submissions processed successfully' };
    } catch (error) {
        console.error('Error processing submissions:', error);
        return { status: 500, message: 'Server error' };
    }
};

router.post('/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const instructorId = req.session.instructorId;
    const courseId = req.session.courseId;
    const result = await processSubmissions(assignmentId, instructorId, courseId);
    res.status(result.status).json({ message: result.message });
});

router.post('/ai/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const instructorId = req.session.instructorId;
    const courseId = req.session.courseId;

    try {
        const response = await axios.post(`http://localhost:5173/ai/assignments/${assignmentId}/process-submissions`, {
            instructorId,
            courseId
        }, {
            withCredentials: true
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Error forwarding grading request: ${error.message}`);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Failed to process submissions' });
        }
    }
});

module.exports = router;