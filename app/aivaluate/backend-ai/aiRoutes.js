const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');
const router = express.Router();
const { pool } = require('./dbConfig');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const cors = require('cors');

const baseDirSubmissions = path.resolve('/app/aivaluate/backend/assignmentSubmissions');
const baseDirKeys = path.resolve('/app/aivaluate/backend/assignmentKeys');

router.use(bodyParser.json());
const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: openaiApiKey });

router.post('/ai/assignments/:assignmentId/test', (req, res) => {
    res.send('AI service endpoint is working');
});

router.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

router.post('/ai/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const instructorId = req.body.instructorId;
    const courseId = req.body.courseId;

    console.log(`Received request to process submissions for assignment ${assignmentId}, course ${courseId}, instructor ${instructorId}`);

    if (!instructorId || !courseId) {
        console.error('Instructor ID and Course ID are required');
        return res.status(400).json({ error: 'Instructor ID and Course ID are required' });
    }

    try {
        const result = await processSubmissions(assignmentId, instructorId, courseId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(`Error processing submissions: ${error.message}`);
        return res.status(500).json({ error: 'Failed to process submissions' });
    }
});

router.post('/gpt/completions', async (req, res) => {
    const { prompt } = req.body;
    log(`Received prompt: ${prompt}`);
  
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 100
        });
  
        res.json({ response: response.choices[0].message.content.trim() });
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

router.post('/gpt/assistants', async (req, res) => {
    const { promptText } = req.body;
    log(`Received promptText: ${promptText}`);

    try {
        const assistantResponse = await openai.beta.assistants.create({
            name: "Grading Assistant",
            instructions: promptText,
            tools: [{ type: "code_interpreter" }, { type: "file_search" }],
            model: 'gpt-4o'
        });

        const assistant = assistantResponse;
        log(`Assistant created: ${JSON.stringify(assistant)}`);
        const threadResponse = await openai.beta.threads.create();

        const thread = threadResponse;
        log(`Thread created: ${JSON.stringify(thread)}`);
        const messageContent = "Grade the student assignments.";

        const messageResponse = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: messageContent
        });

        log(`Message sent to thread: ${JSON.stringify(messageResponse)}`);
        const runResponse = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id
        });

        log(`Run created: ${JSON.stringify(runResponse)}`);
        let response = await openai.beta.threads.runs.get(thread.id, runResponse.id);

        while (response.status === "in_progress" || response.status === "queued") {
            log("Waiting for assistant's response...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            response = await openai.beta.threads.runs.get(thread.id, runResponse.id);
        }

        const threadMessagesResponse = await openai.beta.threads.messages.list(thread.id);

        const messages = threadMessagesResponse.data;
        log(`Messages received: ${JSON.stringify(messages)}`);
        const latestAssistantMessage = messages.filter(message => message.role === 'assistant').pop();

        if (latestAssistantMessage) {
            log(`Assistant's response received: ${JSON.stringify(latestAssistantMessage.content)}`);
            res.json({ response: latestAssistantMessage.content });
        } else {
            res.status(500).json({ error: 'Failed to get assistant response' });
        }
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
        const result = await pool.query('SELECT "promptText" FROM "Prompt" WHERE "instructorId" = $1 AND "isSelected" = true', [instructorId]);
        return result.rows.length > 0 ? result.rows[0].promptText : '';
    } catch (error) {
        console.error('Error fetching selected prompt:', error);
        return '';
    }
};

const getAssignmentRubric = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT "criteria" FROM "AssignmentRubric" ar JOIN "useRubric" ur ON ar."assignmentRubricId" = ur."assignmentRubricId" WHERE ur."assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].criteria : '';
    } catch (error) {
        console.error('Error fetching assignment rubric:', error);
        return '';
    }
};

const getMaxPoints = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT "maxObtainableGrade" FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].maxObtainableGrade : 100;
    } catch (error) {
        console.error('Error fetching max points:', error);
        return 100;
    }
};

const getAssignmentKey = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT "assignmentKey" FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].assignmentKey : '';
    } catch (error) {
        console.error('Error fetching assignment key:', error);
        return '';
    }
};

const processStudentSubmissions = async (studentId, submissions, assistantId, instructorPrompt, assignmentRubric, maxPoints, assignmentKeyPath) => {
    console.log('Processing student submissions for student:', studentId);
    console.log('Submissions:', submissions);
    console.log('Instructor Prompt:', instructorPrompt);
    console.log('Assignment Rubric:', assignmentRubric);
    console.log('Max Points:', maxPoints);
    console.log('Assignment Key Path:', assignmentKeyPath);

    try {
        const submissionFileStreams = submissions.map(file => {
            const filePath = path.resolve(baseDirSubmissions, file.submissionFile.replace('assignmentSubmissions/', ''));
            console.log('Resolved file path:', filePath);
            return fs.createReadStream(filePath);
        });

        console.log('Submission file streams created:', submissionFileStreams);

        let submissionVectorStore = await openai.beta.vectorStores.create({
            name: `Student ${studentId} Submissions`,
        });
        console.log('Submission Vector Store created:', submissionVectorStore.id);

        await openai.beta.vectorStores.fileBatches.uploadAndPoll(submissionVectorStore.id, submissionFileStreams);
        console.log('Submission files uploaded and processed.');

        let assignmentKeyVectorStore = await openai.beta.vectorStores.create({
            name: `Assignment ${studentId} Key`,
        });
        console.log('Assignment Key Vector Store created:', assignmentKeyVectorStore.id);

        await openai.beta.vectorStores.fileBatches.uploadAndPoll(assignmentKeyVectorStore.id, [fs.createReadStream(assignmentKeyPath)]);
        console.log('Assignment key file uploaded and processed.');

        await openai.beta.assistants.update(assistantId, {
            tool_resources: {
                file_search: {
                    vector_store_ids: [submissionVectorStore.id, assignmentKeyVectorStore.id]
                }
            },
        });
        console.log('Assistant updated with vector stores.');

        const threadResponse = await openai.beta.threads.create();
        console.log('Thread created:', threadResponse.id);

        const thread = threadResponse;

        const messageContent = `Grade the student assignment using the following rubric: ${assignmentRubric} and the assignment key provided. The maximum points available for this assignment is ${maxPoints}. Additional Instructions: ${instructorPrompt}`;

        const messageResponse = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: messageContent
        });
        console.log('Message posted to thread:', messageResponse.id);

        if (!messageResponse || messageResponse.status !== 200) {
            throw new Error('Failed to post message to the thread');
        }

        const runResponse = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });
        console.log('Run created:', runResponse.id);

        let response = await openai.beta.threads.runs.get(thread.id, runResponse.id);

        while (response.status === "in_progress" || response.status === "queued") {
            console.log("Waiting for assistant's response...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            response = await openai.beta.threads.runs.get(thread.id, runResponse.id);
        }

        const threadMessagesResponse = await openai.beta.threads.messages.list(thread.id);
        console.log('Thread messages received:', threadMessagesResponse.data);

        const messages = threadMessagesResponse.data;
        const latestAssistantMessage = messages.filter(message => message.role === 'assistant').pop();
        const result = latestAssistantMessage ? JSON.parse(latestAssistantMessage.content) : null;
        console.log('Final assistant response:', result);

        return result;
    } catch (error) {
        console.error('Error processing student submissions:', error);
        throw error;
    }
};

const processSubmissions = async (assignmentId, instructorId, courseId) => {
    console.log('Processing submissions for assignment:', assignmentId);
    console.log('Instructor ID:', instructorId);
    console.log('Course ID:', courseId);

    try {
        const submissions = await pool.query(
            'SELECT * FROM "AssignmentSubmission" WHERE "assignmentId" = $1 AND "isSubmitted" = true',
            [assignmentId]
        );
        console.log('Submissions fetched:', submissions.rows.length);

        if (submissions.rows.length === 0) {
            console.log('No submissions found for this assignment.');
            return { status: 404, message: 'No submissions found for this assignment.' };
        }

        const selectedPrompt = await getSelectedPrompt(instructorId);
        const assignmentRubric = await getAssignmentRubric(assignmentId);
        const maxPoints = await getMaxPoints(assignmentId);
        const assignmentKeyResult = await getAssignmentKey(assignmentId);

        if (!assignmentKeyResult) {
            console.log('Assignment key not found.');
            return { status: 404, message: 'Assignment key not found.' };
        }

        const assignmentKeyPath = path.resolve(baseDirKeys, assignmentKeyResult);
        const assistantResponse = await openai.beta.assistants.create({
            name: "AIValuate Grading Assistant",
            instructions: 'You are a web development expert. Your task is to grade student assignments based on the provided rubric and additional instructions. Provide constructive feedback for each submission, and a grade based on the maximum points available.',
            model: "gpt-4o",
            tools: [{ type: "code_interpreter" }, { type: "file_search" }]
        });
        console.log('Assistant created:', assistantResponse.id);

        const assistant = assistantResponse;
        const assistantId = assistant.id;
        const studentSubmissions = submissions.rows.reduce((acc, submission) => {
            if (!acc[submission.studentId]) {
                acc[submission.studentId] = [];
            }
            acc[submission.studentId].push(submission);
            return acc;
        }, {});

        for (const studentId in studentSubmissions) {
            console.log(`Processing submissions for student: ${studentId}`);
            const aiResponse = await processStudentSubmissions(studentId, studentSubmissions[studentId], assistantId, selectedPrompt, assignmentRubric, maxPoints, assignmentKeyPath);

            if (aiResponse) {
                const grade = aiResponse.grade;
                const feedback = aiResponse.feedback;

                await pool.query(
                    'INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "AIassignedGrade") VALUES ($1, $2, $3) ON CONFLICT ("assignmentSubmissionId", "assignmentId") DO UPDATE SET "AIassignedGrade" = EXCLUDED."AIassignedGrade"',
                    [studentSubmissions[studentId][0].assignmentSubmissionId, assignmentId, grade]
                );
                console.log(`Grade recorded for student: ${studentId}`);

                await pool.query(
                    'INSERT INTO "StudentFeedback" ("studentId", "assignmentId", "courseId", "AIFeedbackText") VALUES ($1, $2, $3, $4) ON CONFLICT ("studentId", "assignmentId") DO UPDATE SET "AIFeedbackText" = EXCLUDED."AIFeedbackText"',
                    [studentId, assignmentId, studentSubmissions[studentId][0].courseId, feedback]
                );
                console.log(`Feedback recorded for student: ${studentId}`);
            }
        }

        console.log('All submissions processed successfully.');
        return { status: 200, message: 'Submissions processed successfully' };
    } catch (error) {
        console.error('Error processing submissions:', error);
        return { status: 500, message: 'Server error' };
    }
};

module.exports = router;