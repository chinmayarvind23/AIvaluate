const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');
const router = express.Router();
const { pool } = require('./dbConfig');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const cors = require('cors');
const parseSafe = require('json-parse-safe');
const baseDirSubmissions = path.resolve('/app/aivaluate/backend/assignmentSubmissions');
const baseDirKeys = path.resolve('/app/aivaluate/backend-eval/assignmentKeys');

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

async function retryRequest(fn, retries = 3, delay = 1000) {
    let attempt = 0;
    const delayPromise = (delay) => new Promise(resolve => setTimeout(resolve, delay));

    while (attempt < retries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            if (attempt >= retries) {
                throw error;
            }
            await delayPromise(delay);
            delay *= 2;
        }
    }
}

router.post('/ai/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const { instructorId, courseId } = req.body;

    console.log(`Received request to process submissions for assignment ${assignmentId}, course ${courseId}, instructor ${instructorId}`);

    if (!instructorId || !courseId) {
        console.error('Instructor ID and Course ID are required');
        return res.status(400).json({ error: 'Instructor ID and Course ID are required' });
    }

    try {
        console.log('Starting submission processing...');
        const result = await processSubmissions(assignmentId, instructorId, courseId);
        console.log('Submission processing completed');
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
            name: "AIValuate Grading Assistant",
            instructions: `You are a web development expert. Your task is to grade student assignments based on the provided rubric and additional instructions. Provide constructive feedback for each submission, and a grade based on the maximum points available. 
            Provide your response in the following JSON format:
            {
                "feedback": "Your detailed feedback here",
                "grade": "Your grade here"
            }`,
            model: "gpt-4o",
            tools: [{ type: "code_interpreter" }, { type: "file_search" }]
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
        let response = await openai.beta.threads.runs.retrieve(thread.id, runResponse.id);
        while (response.status === "in_progress" || response.status === "queued") {
            console.log("Waiting for assistant's response...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            response = await openai.beta.threads.runs.retrieve(thread.id, runResponse.id);
        }

        const threadMessagesResponse = await openai.beta.threads.messages.list(thread.id);

        const messages = threadMessagesResponse.data || [];
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
        if (result.rows.length > 0) {
            const assignmentKey = result.rows[0].assignmentKey;
            console.log(`Original assignmentKey from DB: ${assignmentKey}`);
            if (assignmentKey) {
                const keyPath = path.resolve(baseDirKeys, assignmentKey);
                console.log(`Resolved assignment key path: ${keyPath}`);
                if (fs.existsSync(keyPath)) {
                    console.log(`Assignment key found at path: ${keyPath}`);
                    return keyPath;
                } else {
                    console.error(`Assignment key file not found: ${keyPath}`);
                    return null;
                }
            }
        }
        console.error(`Assignment key not found in database for assignmentId: ${assignmentId}`);
        return null;        
    } catch (error) {
        console.error('Error fetching assignment key:', error);
        return null;
    }
};

const uploadFileToOpenAI = async (filePath, purpose, label) => {
    try {
        const fileStream = fs.createReadStream(filePath);
        const response = await openai.files.create({
            file: fileStream,
            purpose: purpose
        });
        return response.id;
    } catch (error) {
        console.error(`Error uploading file to OpenAI: ${error.message}`);
        throw error;
    }
};

// Parses AI response with regex patterns to extract grades and feedback
const parseAIResponse = (aiResponse) => {
    const response = {
        grade: 0,
        feedback: 'The AI was unable to provide a grade for the submission(s) of this student. Please manually enter a grade and provide feedback.'
    };

    try {
        const aiResponseString = typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse);
        console.log("AI Response String:", aiResponseString);
        const jsonStringMatch = aiResponseString.match(/```json\s*([\s\S]+?)\s*```/m);
        if (!jsonStringMatch) {
            throw new Error('Invalid AI response format');
        }

        let jsonString = jsonStringMatch[1];
        jsonString = jsonString.replace(/\\n/g, ' ')
                               .replace(/\\'/g, "'")
                               .replace(/\\"/g, '"')
                               .replace(/\\t/g, ' ')
                               .replace(/\\r/g, ' ')
                               .replace(/\s+/g, ' ')
                               .trim();

        const parsed = parseSafe(jsonString);
        if (parsed.error) {
            throw new Error('Error parsing AI response JSON');
        }

        const feedbackMatch = parsed.value.feedback || parsed.value.Feedback;
        const gradeMatch = parsed.value.grade || parsed.value.Grade;

        if (feedbackMatch) {
            response.feedback = feedbackMatch.substring(0, 20000);
        }

        if (gradeMatch) {
            const gradeValue = parseFloat(gradeMatch.match(/[\d.]+/)[0]);
            response.grade = gradeValue;
        }
    } catch (error) {
        console.error('Error parsing AI response:', error);
    }

    console.log("Parsed Response:", response);
    return response;
};

// Processes student submissions as a whole and creates the setup for the individual students' submissions to be processed
const processStudentSubmissions = async (studentId, submissions, assistantId, instructorPrompt, assignmentRubric, maxPoints, assignmentKeyPath) => {
    console.log('Processing student submissions for student:', studentId);
    console.log('Submissions:', submissions);
    console.log('Instructor Prompt:', instructorPrompt);
    console.log('Assignment Rubric:', assignmentRubric);
    console.log('Max Points:', maxPoints);
    console.log('Assignment Key Path:', assignmentKeyPath);

    try {
        let assignmentKeyFileId = null;
        if (assignmentKeyPath && fs.existsSync(assignmentKeyPath)) {
            assignmentKeyFileId = await uploadFileToOpenAI(assignmentKeyPath, 'assistants');
            console.log('Assignment key file ID created:', assignmentKeyFileId);
        } else {
            console.log('No assignment key provided.');
        }

        const submissionFileIds = [];
        for (const file of submissions) {
            const filePath = path.resolve(baseDirSubmissions, file.submissionFile.replace('assignmentSubmissions/', ''));
            console.log('Resolved file path:', filePath);
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }
            const fileId = await uploadFileToOpenAI(filePath, 'assistants');
            submissionFileIds.push(fileId);
        }
        console.log('Submission file IDs created:', submissionFileIds);

        const threadResponse = await retryRequest(() => openai.beta.threads.create());
        console.log('Thread created:', threadResponse.id);
        const thread = threadResponse.id;
        let messageContent = `Grade the student's assignment submissions for accuracy using the following rubric: ${assignmentRubric}. The maximum points available for this assignment is ${maxPoints}. Provide your response in the following JSON format:
        {
            "feedback": "Your detailed feedback here",
            "grade": "Your grade here"
        }`;
        if (assignmentKeyFileId) {
            messageContent += ` The file with ID ${assignmentKeyFileId} is the assignment key to be used to grade the students' submissions.`;
        }
        messageContent += ` The following files are the student's submissions: ${submissionFileIds.join(', ')}.`;
        if (instructorPrompt) {
            messageContent += ` Additional Instructions: ${instructorPrompt}`;
        }

        const attachments = submissionFileIds.map(file_id => ({ file_id, tools: [{ type: 'file_search' }] }));
        if (assignmentKeyFileId) {
            attachments.unshift({ file_id: assignmentKeyFileId, tools: [{ type: 'file_search' }] });
        }

        try {
            const messageResponse = await retryRequest(() => openai.beta.threads.messages.create(thread, {
                role: "user",
                content: messageContent,
                attachments: attachments
            }));
            console.log('Message posted to thread:', messageResponse.id);
        } catch (error) {
            console.error(`Error posting message to thread: ${error.message}`);
            throw error;
        }

        const runResponse = await retryRequest(() => openai.beta.threads.runs.create(thread, {
            assistant_id: assistantId,
        }));
        console.log('Run created:', runResponse.id);

        let response;
        try {
            response = await retryRequest(() => openai.beta.threads.runs.retrieve(thread, runResponse.id));
            while (response.status === "in_progress" || response.status === "queued") {
                console.log("Waiting for assistant's response...");
                await new Promise(resolve => setTimeout(resolve, 5000));
                response = await retryRequest(() => openai.beta.threads.runs.retrieve(thread, runResponse.id));
            }

            const threadMessagesResponse = await retryRequest(() => openai.beta.threads.messages.list(thread));
            const messages = threadMessagesResponse.data || [];
            const latestAssistantMessage = messages.filter(message => message.role === 'assistant').pop();

            let result;
            if (latestAssistantMessage) {
                try {
                    if (typeof latestAssistantMessage.content === 'string') {
                        result = JSON.parse(latestAssistantMessage.content);
                    } else {
                        result = latestAssistantMessage.content;
                    }
                } catch (error) {
                    console.error('Error parsing JSON content:', error);
                    result = latestAssistantMessage.content;
                }
            } else {
                result = null;
            }

            console.log('Final assistant response:', result);
            if (result) {
                const parsedResponse = parseAIResponse(result);

                if (parsedResponse.grade !== 0) {
                    try {
                        await pool.query(
                            'INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "isGraded") VALUES ($1, $2, $3, $4, true) ON CONFLICT ("assignmentSubmissionId", "assignmentId") DO UPDATE SET "AIassignedGrade" = EXCLUDED."AIassignedGrade","isGraded" = EXCLUDED."isGraded";',
                            [submissions[0].assignmentSubmissionId, submissions[0].assignmentId, maxPoints, parsedResponse.grade]
                        );
                        console.log(`Grade recorded for student: ${studentId}`);
                    } catch (error) {
                        console.error(`Error recording grade for student ${studentId}:`, error);
                    }
                } else {
                    console.error(`Parsed grade is 0 for student: ${studentId}. Response: ${JSON.stringify(result)}`);
                }

                if (parsedResponse.feedback) {
                    try {
                        await pool.query(
                            'INSERT INTO "StudentFeedback" ("studentId", "assignmentId", "courseId", "AIFeedbackText") VALUES ($1, $2, $3, $4) ON CONFLICT ("studentId", "assignmentId", "courseId") DO UPDATE SET "AIFeedbackText" = EXCLUDED."AIFeedbackText"',
                            [studentId, submissions[0].assignmentId, submissions[0].courseId, parsedResponse.feedback]
                        );
                        console.log(`Feedback recorded for student: ${studentId}`);
                    } catch (error) {
                        console.error(`Error recording feedback for student ${studentId}:`, error);
                    }
                } else {
                    console.error(`Parsed feedback is empty for student: ${studentId}. Response: ${JSON.stringify(result)}`);
                }
            } else {
                console.error(`No valid response from AI for student: ${studentId}. Response: ${JSON.stringify(result)}`);
            }
        } catch (error) {
            console.error('Error processing student submissions:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error in processStudentSubmissions:', error);
        throw error;
    }
};

// Process individual student submissions
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

        const selectedPrompt = await getSelectedPrompt(instructorId) || '';
        const assignmentRubric = await getAssignmentRubric(assignmentId);
        const maxPoints = await getMaxPoints(assignmentId);
        const assignmentKeyResult = await getAssignmentKey(assignmentId);
        const assignmentKeyPath = assignmentKeyResult ? path.resolve(baseDirKeys, assignmentKeyResult) : null;
        const assistantResponse = await openai.beta.assistants.create({
            name: "AIValuate Grading Assistant",
            instructions: `You are a web development expert. Your task is to grade student assignments based on the provided rubric and additional instructions. Provide constructive feedback for each submission, and a grade based on the maximum points available. 
            Provide your response in the following JSON format:
            {
                "feedback": "Your detailed feedback here",
                "grade": "Your grade here"
            }`,
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
            await processStudentSubmissions(studentId, studentSubmissions[studentId], assistantId, selectedPrompt, assignmentRubric, maxPoints, assignmentKeyPath);
        }

        console.log('All submissions processed successfully.');
        return { status: 200, message: 'Submissions processed successfully' };
    } catch (error) {
        console.error('Error processing submissions:', error);
        return { status: 500, message: 'Server error' };
    }
};

module.exports = router;