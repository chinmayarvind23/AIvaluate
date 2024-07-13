const request = require('supertest');
const app = require('../server'); // Adjust the path as necessary

describe('POST /api/llama', () => {
  it('should return a response from Ollama service', async () => {
    const res = await request(app)
      .post('http://localhost:5173/ai-api/api/llama')
      .send({ prompt: 'Hello, LLaMA!' });

    expect(res.status).toBe(200);
    expect(res.body.response).toBeDefined();
  });

  it('should handle errors from Ollama service', async () => {
    const res = await request(app)
      .post('http://localhost:5173/ai-api/api/llama')
      .send({ prompt: 'This will cause an error' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to communicate with AI model' });
  });
});
