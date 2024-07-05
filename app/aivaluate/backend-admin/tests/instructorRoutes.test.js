const request = require('supertest');
const express = require('express');

// The following code is used to mock the database connection by creating a mock of the dbConfig module
jest.mock('../dbConfig', () => ({
  pool: {
    query: jest.fn()
  }
}));
const { pool } = require('../dbConfig');
const instructorRoutes = require('../routes/instructorRoutes');

//This is just to set up out express app and use the instructorRoutes
const app = express();
app.use(express.json());
app.use(instructorRoutes);

// This simply clears all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /tas', () => {
  test('should return a list of TAs on success', async () => {
    const mockTAs = [{ id: 1, name: 'TA1' }, { id: 2, name: 'TA2' }]; // Mock data
    pool.query.mockResolvedValue({ rows: mockTAs }); // Mock the database query to return the mock data
    const response = await request(app).get('/tas'); // Make a request to the endpoint
    expect(response.status).toBe(200); // Check if the response status is 200
    expect(response.body).toEqual(mockTAs); // Check if the response body is the mock data
  });

  test('should return 500 on database error', async () => {
    pool.query.mockRejectedValue(new Error('Database error')); // Mock the database query to throw an error
    const response = await request(app).get('/tas'); // Make a request to the endpoint
    expect(response.status).toBe(500); // Check if the response status is 500
    expect(response.body).toEqual({ message: 'Error fetching TAs' }); // Check if the response body is the error message
  });
});

describe('DELETE /teaches/:courseId/:instructorId', () => {
  test('should return 200 on successful deletion', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 }); // Mock the database query to return a row count of 1
    const response = await request(app).delete('/teaches/1/2'); // Make a request to the endpoint
    expect(response.status).toBe(200); // Check if the response status is 200
    expect(response.body).toEqual({ message: 'Instructor/TA removed from course successfully' }); // Check if the response body is the success message
  });

  test('should return 500 on database error', async () => {
    pool.query.mockRejectedValue(new Error('Database error')); // Mock the database query to throw an error
    const response = await request(app).delete('/teaches/1/2'); // Make a request to the endpoint
    expect(response.status).toBe(500); // Check if the response status is 500
    expect(response.body).toEqual({ message: 'Error removing Instructor/TA from course' }); // Check if the response body is the error message
  });
});