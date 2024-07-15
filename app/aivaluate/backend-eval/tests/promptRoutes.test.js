const request = require('supertest');
const express = require('express');
const router = require('../routes/promptRoutes'); // Adjust the path as needed
const { pool } = require('../dbConfig');

const app = express();
app.use(express.json());
app.use('/eval-api', router);

// Mock the database connection pool
jest.mock('../dbConfig', () => {
    const mockPool = {
        query: jest.fn()
    };
    return { pool: mockPool };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Prompt Routes', () => {
    const instructorId = 1;
    const promptId = 1;
    const mockPrompt = { promptId, promptName: 'Test Prompt', promptText: 'Test Text', instructorId, isSelected: true };

    it('should fetch selected prompt by instructor id', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockPrompt] });

        const res = await request(app).get(`/eval-api/prompt/${instructorId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockPrompt);
    });

    it('should return 404 if no prompt selected', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get(`/eval-api/prompt/${instructorId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('No prompt selected');
    });

    it('should fetch all prompts by instructor id', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockPrompt] });

        const res = await request(app).get(`/eval-api/prompts/${instructorId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockPrompt]);
    });

    it('should create a new prompt', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockPrompt] });

        const res = await request(app)
            .post('/eval-api/prompt')
            .send({ promptName: 'Test Prompt', promptText: 'Test Text', instructorId });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockPrompt);
    });

    it('should delete a prompt', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app).delete(`/eval-api/prompt/${promptId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Prompt was deleted');
    });

    it('should update a prompt name', async () => {
        const updatedPrompt = { ...mockPrompt, promptName: 'Updated Prompt' };
        pool.query.mockResolvedValueOnce({ rows: [updatedPrompt] });

        const res = await request(app)
            .put(`/eval-api/prompt/name/${promptId}`)
            .send({ promptName: 'Updated Prompt' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedPrompt);
    });

    it('should update a prompt text', async () => {
        const updatedPrompt = { ...mockPrompt, promptText: 'Updated Text' };
        pool.query.mockResolvedValueOnce({ rows: [updatedPrompt] });

        const res = await request(app)
            .put(`/eval-api/prompt/text/${promptId}`)
            .send({ promptText: 'Updated Text' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedPrompt);
    });

    it('should select a prompt and clear others', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });
        pool.query.mockResolvedValueOnce({ rows: [mockPrompt] });

        const res = await request(app)
            .put(`/eval-api/prompt/select/${promptId}`)
            .send({ instructorId });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockPrompt);
    });

    it('should clear all selected prompts for an instructor', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app).put(`/eval-api/prompt/clear/${instructorId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('All prompts cleared');
    });
});
