const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const logger = require('../logger'); // Make sure this path is correct

// Mock the pg module correctly
jest.mock('pg', () => ({
    Pool: jest.fn(() => ({
        query: jest.fn()
    }))
}));

// Instantiate the mocked pool
const pool = new Pool();

const app = express();
app.use(bodyParser.json());

// Mocking the authentication
const checkAuthenticated = (req, res, next) => {
  req.isAuthenticated = () => true; // Simulate that all users are authenticated
  req.user = { studentId: '1' }; // Mocked user
  next();
};

app.use(checkAuthenticated);

const router = express.Router();

router.get('/student-grades/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    const studentInfoResult = await pool.query(
      `SELECT firstName, totalGrade, totalMaxGrade FROM "Grades" WHERE "courseId" = $1`, [courseId]
    );
    const assignmentDetailsResult = await pool.query(
      `SELECT name, due, submitted, score, total, marked FROM "Assignments" WHERE "courseId" = $1`, [courseId]
    );

    res.status(200).json({
      studentName: studentInfoResult.rows[0].firstName,
      totalGrade: studentInfoResult.rows[0].totalGrade,
      totalMaxGrade: studentInfoResult.rows[0].totalMaxGrade,
      assignments: assignmentDetailsResult.rows
    });
  } catch (error) {
    logger.error('Error fetching student grades: ' + error.message);
    res.status(500).json({ error: 'Database error' }); // Unified error message
  }
});

app.use('/stu-api', router);

// Tests for GET /student-grades/:courseId
describe('GET /stu-api/student-grades/:courseId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch student name and grade details for a course', async () => {
    const courseId = '1';
    const mockStudentInfo = { rows: [{ firstName: 'John', totalGrade: 95, totalMaxGrade: 100 }] };
    const mockAssignmentDetails = {
      rows: [
        { name: 'Assignment 1', due: '2022-01-15', submitted: true, score: 95, total: 100, marked: true },
        { name: 'Assignment 2', due: '2022-02-10', submitted: false, score: 0, total: 100, marked: false }
      ]
    };

    pool.query.mockResolvedValueOnce(mockStudentInfo).mockResolvedValueOnce(mockAssignmentDetails);

    const response = await request(app).get(`/stu-api/student-grades/${courseId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      studentName: 'John',
      totalGrade: 95,
      totalMaxGrade: 100,
      assignments: mockAssignmentDetails.rows
    });
  });

  it('should return 500 on database error', async () => {
    const courseId = '1';
    pool.query.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get(`/stu-api/student-grades/${courseId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});