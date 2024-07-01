// tests/StudentGrades.test.js

const request = require('supertest');
const express = require('express');
const gradeRoutes = require('../routes/gradeRoutes');
const { pool } = require('../dbConfig');

jest.mock('../dbConfig');

const app = express();
app.use(express.json());
app.use('/stu-api', gradeRoutes);

// Mock the authentication middleware
const mockCheckAuthenticated = (req, res, next) => {
  req.isAuthenticated = () => true;
  req.user = { studentId: 4 };
  next();
};

app.use(mockCheckAuthenticated);

describe('GET /stu-api/student-grades/:courseId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return student grades for a valid request', async () => {
    const studentInfo = {
      firstName: 'Omar',
      totalGrade: 173,
      totalMaxGrade: 200,
    };

    const assignmentDetails = [
      {
        name: 'Design a login page with html and css',
        due: '2024-06-30',
        submitted: true,
        score: 10,
        total: 10,
        marked: true,
      },
      {
        name: 'Design an account page with html and css',
        due: '2024-07-05',
        submitted: false,
        score: 0,
        total: 25,
        marked: false,
      },
    ];

    pool.query
      .mockResolvedValueOnce({ rows: [studentInfo] })
      .mockResolvedValueOnce({ rows: assignmentDetails });

    const res = await request(app).get('/stu-api/student-grades/3').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      studentName: 'Omar',
      totalGrade: 173,
      totalMaxGrade: 200,
      assignments: assignmentDetails,
    });
  });

  it('should handle database errors gracefully', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app).get('/stu-api/student-grades/3').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Database error' });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const mockCheckUnauthenticated = (req, res, next) => {
      req.isAuthenticated = () => false;
      res.redirect = jest.fn(() => {
        res.status(302).json({ location: '/stu-api/login' });
      });
      next();
    };

    app.use(mockCheckUnauthenticated);

    const res = await request(app).get('/stu-api/student-grades/3').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(302); // Redirect status
    expect(res.body.location).toBe('/stu-api/login');
  });
});
