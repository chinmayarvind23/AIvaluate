const request = require('supertest');
const express = require('express');
const router = require('../routes/studentRoutes'); 
const { pool } = require('../dbConfig');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    req.isAuthenticated = () => true;
    next();
});
app.use('/admin-api', router);

jest.mock('../dbConfig', () => {
    const pool = {
        query: jest.fn(),
    };
    return { pool };
});

describe('Student Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /admin-api/student/:studentId', () => {
        it('should fetch student details and enrolled courses', async () => {
            const studentId = 1;
            const studentQueryResult = {
                rows: [
                    {
                        studentId: studentId,
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@example.com',
                        password: 'hashedpassword',
                    },
                ],
            };

            const courseQueryResult = {
                rows: [
                    { courseCode: 'CS101', courseId: 1 },
                    { courseCode: 'CS102', courseId: 2 },
                ],
            };

            pool.query
                .mockResolvedValueOnce(studentQueryResult)
                .mockResolvedValueOnce(courseQueryResult);

            const res = await request(app).get(`/admin-api/student/${studentId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                studentId: studentId,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'hashedpassword',
                courses: [
                    { courseCode: 'CS101', courseId: 1 },
                    { courseCode: 'CS102', courseId: 2 },
                ],
            });
        });
    });

    describe('DELETE /admin-api/student/:studentId/drop/:courseCode', () => {
        it('should drop a course for a student', async () => {
            const studentId = 1;
            const courseCode = 'CS101';

            pool.query.mockResolvedValueOnce({});

            const res = await request(app)
                .delete(`/admin-api/student/${studentId}/drop/${courseCode}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Course dropped successfully' });
        });
    });

    describe('DELETE /admin-api/student/:studentId', () => {
        it('should delete a student', async () => {
            const studentId = 1;

            pool.query.mockResolvedValueOnce({});

            const res = await request(app)
                .delete(`/admin-api/student/${studentId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'User deleted successfully' });
        });
    });
});