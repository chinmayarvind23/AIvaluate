const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const { app, server } = require('../server'); // Adjust the path as necessary
const { pool } = require('../dbConfig');

afterAll(done => {
    server.close(() => {
        pool.end().then(() => done());
    });
});

describe('Database Connectivity', () => {
  it('should return the current time from the database', async () => {
    const response = await request(app).get('/test-db');
    console.log('Response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body).toHaveProperty('time');
  });

  it('should handle database errors gracefully', async () => {
    // Mock the pool.query method to throw an error
    const originalQuery = pool.query;
    pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/test-db');
    expect(response.status).toBe(500);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Database error');

    // Restore the original query method
    pool.query = originalQuery;
  });
});