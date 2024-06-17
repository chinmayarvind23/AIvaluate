const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const courseRoutes = require('../routes/courseRoutes');
const { pool } = require('../dbConfig');

// Mock data
const mockCourse = {
  courseName: 'Mathematics',
  courseCode: 'MATH101',
  maxStudents: 30
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', courseRoutes);

describe('Course Routes', () => {
  afterAll(async () => {
    await pool.end();
  });

  test('POST /courses - should create a new course', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [{ courseId: 1 }] });

    const response = await request(app)
      .post('/courses')
      .send(mockCourse);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      courseId: 1,
      message: 'Course created successfully'
    });
  });

  test('GET /courses - should return list of courses', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [mockCourse] });

    const response = await request(app).get('/courses');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockCourse]);
  });
});
