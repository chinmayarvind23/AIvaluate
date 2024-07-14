const request = require('supertest');
const app = require('../server');
const { exec } = require('child_process');

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('POST /api/llama', () => {
  it('should return a response from Ollama service', async () => {
    exec.mockImplementation((cmd, callback) => {
      callback(null, 'AI response', '');
    });

    const res = await request(app)
      .post('/api/llama')
      .send({ prompt: 'Hello, LLaMA!' });

    expect(res.status).toBe(200);
    expect(res.body.response).toBe('AI response');
  });

  it('should handle errors from Ollama service', async () => {
    exec.mockImplementation((cmd, callback) => {
      callback(new Error('Error'), '', 'Error');
    });

    const res = await request(app)
      .post('/api/llama')
      .send({ prompt: 'This will cause an error' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to communicate with AI model' });
  });
});
