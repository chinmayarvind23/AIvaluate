// tests/enrolledCourses.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const pool = {
  query: jest.fn()
};

// Mocking the authentication 
const checkAuthenticated = (req, res, next) => {
  req.user = { studentId: 'student123' }; // Mocked user
  next();
};

const app = express();
app.use(bodyParser.json());

// Define the enrolled courses route
app.get('/enrolled-courses', checkAuthenticated, (req, res) => {
  const studentId = req.user.studentId;

  pool.query(
    `SELECT "Course"."courseId", "Course"."courseCode", "Course"."courseName"
     FROM "EnrolledIn" 
     JOIN "Course" ON "EnrolledIn"."courseId" = "Course"."courseId" 
     WHERE "EnrolledIn"."studentId" = $1`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results.rows);
    }
  );
});

describe('GET /enrolled-courses', () => {
  it('should return enrolled courses for the student', async () => {
    const mockCourses = [
      { courseId: 'course1', courseCode: 'CS101', courseName: 'Intro to Computer Science' },
      { courseId: 'course2', courseCode: 'CS102', courseName: 'Data Structures' }
    ];

    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: mockCourses }); // Simulate successful query
    });

    const response = await request(app)
      .get('/enrolled-courses')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCourses);
  });

  it('should return a database error', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(new Error('Database error'), null); // Simulate database error
    });

    const response = await request(app)
      .get('/enrolled-courses')
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
