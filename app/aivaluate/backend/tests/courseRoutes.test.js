const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const logger = require('../logger'); // Ensure this path is correct

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

app.get('/courses', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Course"');
        res.status(200).send(courses.rows);
    } catch (error) {
        logger.error('Error fetching courses: ' + error.message);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

// Tests should now recognize `pool`
describe('GET /courses', () => {
    it('should fetch all courses successfully', async () => {
        const mockCourses = [
            { courseId: 1, courseName: "Introduction to Programming", courseDescription: "An introductory course on programming" },
            { courseId: 2, courseName: "Advanced CSS", courseDescription: "A course on advanced CSS techniques" }
        ];

        pool.query.mockResolvedValue({ rows: mockCourses });

        const response = await request(app).get('/courses');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCourses);
    });

    it('should handle database errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/courses');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Error fetching courses' });
    });
});
