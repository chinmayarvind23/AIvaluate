const request = require('supertest');
const express = require('express');
const { Configuration, OpenAIApi } = require('openai'); // Correct import based on the updated usage
const { Pool } = require('pg');
const app = express();

// Replace body-parser with express built-in methods if using Express 4.16.0 or newer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const aiRoutes = require('../aiRoutes'); // Ensure the path is correct
app.use('/ai', aiRoutes);

// Mock the PostgreSQL pool
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 })
    };
    return { Pool: jest.fn(() => mPool) };
});

// Mock the OpenAI API according to the correct structure
jest.mock('openai', () => {
    return {
        Configuration: jest.fn().mockImplementation(() => ({})),
        OpenAIApi: jest.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: jest.fn().mockResolvedValue({
                        choices: [{ message: { content: 'AI service endpoint is working' } }]
                    })
                }
            }
        }))
    };
});

describe('AI Routes', () => {
    let server;

    beforeAll(() => {
        server = app.listen(); // Listen without specifying a port to avoid EADDRINUSE error
    });

    afterAll((done) => {
        server.close(done); // Close the server after tests to clean up resources
    });

    describe('POST /ai/assignments/:assignmentId/test', () => {
        it('should confirm the AI service endpoint is working', async () => {
            const response = await request(server)
                .post('/ai/assignments/123/test')
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('AI service endpoint is working');
        });
    });

    describe('POST /ai/assignments/:assignmentId/process-submissions', () => {
        it('should process submissions successfully', async () => {
            const pool = new Pool();
            pool.query.mockResolvedValueOnce({
                rows: [{ assignmentId: '123', instructorId: '1', courseId: '10' }],
                rowCount: 1
            });

            const response = await request(server)
                .post('/ai/assignments/123/process-submissions')
                .send({ instructorId: '1', courseId: '10' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Submissions processed successfully');
        });

        it('should handle missing instructorId and courseId', async () => {
            const response = await request(server)
                .post('/ai/assignments/123/process-submissions')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Instructor ID and Course ID are required');
        });
    });
});
