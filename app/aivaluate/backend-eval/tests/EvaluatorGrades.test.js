const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const evaluatorGradesRoutes = require('../routes/evaluatorGrades'); // Importing the route to test

// Mocking the database pool
const mockPool = {
  query: jest.fn()
};

// Mocking the dbConfig to use the mocked pool
jest.mock('../dbConfig', () => ({
  pool: mockPool
}));

const app = express();
app.use(bodyParser.json());

// Mocking the checkAuthenticated middleware
const checkAuthenticated = (req, res, next) => {
  req.user = { studentId: 1 }; // Mocked authenticated user
  next();
};

// Use the middleware in the app for this test
app.use((req, res, next) => checkAuthenticated(req, res, next));
app.use('/stu-api', evaluatorGradesRoutes);

describe('GET /stu-api/evaluator-grades/:courseId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return evaluator grades for a specific course ordered by date', async () => {
    // Mock the database responses
    mockPool.query
      .mockResolvedValueOnce({
        rows: [
          {
            name: 'Assignment 1',
            due: '2024-06-04',
            avgGrade: 90,
            totalGrade: 100
          },
          {
            name: 'Assignment 2',
            due: '2024-07-04',
            avgGrade: 80,
            totalGrade: 100
          }
        ]
      });

    const response = await request(app)
      .get('/stu-api/evaluator-grades/1')
      .set('Accept', 'application/json');

    console.log('Response Body:', response.body); // Debugging line to print response body
    console.log('Response Status:', response.status); // Debugging line to print response status

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        name: 'Assignment 1',
        due: '2024-06-04',
        avgGrade: 90,
        totalGrade: 100
      },
      {
        name: 'Assignment 2',
        due: '2024-07-04',
        avgGrade: 80,
        totalGrade: 100
      }
    ]);
  });

  it('should handle database errors gracefully', async () => {
    // Mock a database error
    mockPool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/stu-api/evaluator-grades/1')
      .set('Accept', 'application/json');

    console.log('Response Body:', response.body); // Debugging line to print response body
    console.log('Response Status:', response.status); // Debugging line to print response status

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });

  it('should return an empty array if no assignments are found', async () => {
    // Mock the database responses
    mockPool.query
      .mockResolvedValueOnce({
        rows: []
      });

    const response = await request(app)
      .get('/stu-api/evaluator-grades/1')
      .set('Accept', 'application/json');

    console.log('Response Body:', response.body); // Debugging line to print response body
    console.log('Response Status:', response.status); // Debugging line to print response status

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
