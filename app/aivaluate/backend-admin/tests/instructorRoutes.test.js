const request = require('supertest');
const express = require('express');
jest.mock('../dbConfig', () => ({
  pool: {
    query: jest.fn()
  }
}));
const { pool } = require('../dbConfig');
const instructorRoutes = require('../routes/instructorRoutes');

const app = express();
app.use(express.json());
app.use(instructorRoutes);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /tas', () => {
  test('should return a list of TAs on success', async () => {
    const mockTAs = [{ id: 1, name: 'TA1' }, { id: 2, name: 'TA2' }];
    pool.query.mockResolvedValue({ rows: mockTAs });
    const response = await request(app).get('/tas');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTAs);
  });

  test('should return 500 on database error', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));
    const response = await request(app).get('/tas');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching TAs' });
  });
});

describe('DELETE /teaches/:courseId/:instructorId', () => {
  test('should return 200 on successful deletion', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });
    const response = await request(app).delete('/teaches/1/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Instructor/TA removed from course successfully' });
  });

  test('should return 500 on database error', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));
    const response = await request(app).delete('/teaches/1/2');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error removing Instructor/TA from course' });
  });
});