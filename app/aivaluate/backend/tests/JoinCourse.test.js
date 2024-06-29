// tests/enrollment.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mocking the database pool
const pool = {
  query: jest.fn()
};

// Mocking the authentication middleware
const checkAuthenticated = (req, res, next) => {
  req.user = { studentId: '5' }; // Mocked user
  next();
};

// Create the express app and apply middlewares
const app = express();
app.use(bodyParser.json());

// Define the enrollment route
app.post('/enroll-course', checkAuthenticated, (req, res) => {
  const studentId = req.user.studentId;
  const { courseId } = req.body;

  pool.query(
    `INSERT INTO "EnrolledIn" ("studentId", "courseId") VALUES ($1, $2)`,
    [studentId, courseId],
    (err, results) => {
      if (err) {
        console.error('Error enrolling student:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Successfully enrolled in the course' });
    }
  );
});

describe('POST /enroll-course', () => {
  it('should enroll in the course successfully', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [] }); // Simulate successful query
    });

    const response = await request(app)
      .post('/enroll-course')
      .send({ courseId: '2' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Successfully enrolled in the course' });
  });

  it('should return a database error', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(new Error('Database error'), null); // Simulate database error
    });

    const response = await request(app)
      .post('/enroll-course')
      .send({ courseId: '2' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
