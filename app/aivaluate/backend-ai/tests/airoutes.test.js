const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const logger = require('../ailogger'); // Make sure this is correct and mock if necessary

jest.mock('pg', () => {
    const mPool = {
        query: jest.fn()
    };
    return { Pool: jest.fn(() => mPool) };
});

// Assuming OpenAI is used like this in your routes
jest.mock('openai', () => {
    return {
        OpenAI: function() {
            return {
                chat: {
                    completions: {
                        create: jest.fn().mockResolvedValue({
                            choices: [{ message: { content: 'AI service endpoint is working' } }]
                        })
                    }
                }
            };
        }
    };
});

jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn().mockResolvedValue({
            newContext: jest.fn().mockResolvedValue({
                newPage: jest.fn().mockResolvedValue({
                    goto: jest.fn().mockResolvedValue(),
                    content: jest.fn().mockResolvedValue('Page Content')
                }),
                close: jest.fn().mockResolvedValue()
            })
        })
    }
}));

const app = express();
app.use(bodyParser.json());
const aiRoutes = require('../aiRoutes'); // Make sure path is correct
app.use('/ai', aiRoutes);

describe('AI Routes', () => {
    describe('POST /ai/assignments/:assignmentId/test', () => {
        it('should confirm the AI service endpoint is working', async () => {
            const response = await request(app)
                .post('/ai/assignments/123/test')
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('AI service endpoint is working');
        });
    });

    describe('POST /ai/assignments/:assignmentId/process-submissions', () => {
        it('should process submissions successfully', async () => {
            const mockData = {
                rows: [{ assignmentId: '123', instructorId: '1', courseId: '10' }]
            };
            const pool = new Pool();
            pool.query.mockResolvedValueOnce(mockData);

            const response = await request(app)
                .post('/ai/assignments/123/process-submissions')
                .send({
                    instructorId: '1',
                    courseId: '10'
                });
            expect(response.status).toBe(200);
            expect(response.body.message).toEqual('Submission processing completed');
        });

        it('should handle missing instructorId and courseId', async () => {
            const response = await request(app)
                .post('/ai/assignments/123/process-submissions')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('Instructor ID and Course ID are required');
        });
    });
});
