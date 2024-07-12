const request = require('supertest');
const express = require('express');
const { pool } = require('../dbConfig'); // Adjust the path as necessary

const app = express();
app.use(express.json());

app.get('/test-db-connection', async (req, res) => {
  try {
    // console.log('Attempting to connect to the database...');
    const result = await pool.query('SELECT 1');
    res.status(200).json({ message: 'Database connection successful', result: result.rows });
  } catch (err) {
    // console.error('Database connection error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

describe('Database Connection Tests', () => {
  afterAll(async () => {
    // Close the pool after all tests are done
    await pool.end();
  });

  test('should return successful database connection message', async () => {
    const response = await request(app).get('/test-db-connection');
    // console.log('Response:', response.body); // Log the response for debugging
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Database connection successful');
  });

  test('should return error message on database connection failure', async () => {
    // Temporarily mock the pool.query method to throw an error
    const originalQuery = pool.query;
    pool.query = jest.fn(() => { throw new Error('Simulated failure'); });

    const response = await request(app).get('/test-db-connection');
    // console.log('Error Response:', response.body); // Log the error response for debugging
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Database connection failed');

    // Restore the original pool.query method
    pool.query = originalQuery;
  });
});
