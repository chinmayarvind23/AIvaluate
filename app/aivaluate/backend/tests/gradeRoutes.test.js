const request = require('supertest');
const express = require('express');
const router = require('../routes/gradeRoutes');
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
    req.user = { studentId: 1 };
    next();
});
app.use('/stu-api', router);

jest.mock('../dbConfig', () => {
    const pool = {
        query: jest.fn(),
    };
    return { pool };
});

describe('Student Grades Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /stu-api/student-grades/:courseId', () => {
        it('should fetch student name and grade details for a course', async () => {
            const courseId = 1;
            const studentInfoResult = {
                rows: [
                    {
                        firstName: 'John',
                        totalGrade: 95,
                        totalMaxGrade: 100,
                    },
                ],
            };
            const assignmentDetailsResult = {
                rows: [
                    {
                        name: 'Assignment 1',
                        due: '2022-01-15',
                        submitted: true,
                        score: 95,
                        total: 100,
                        marked: true,
                    },
                    {
                        name: 'Assignment 2',
                        due: '2022-02-10',
                        submitted: false,
                        score: 0,
                        total: 100,
                        marked: false,
                    },
                ],
            };

            pool.query.mockResolvedValueOnce(studentInfoResult);
            pool.query.mockResolvedValueOnce(assignmentDetailsResult);

            const res = await request(app).get(`/stu-api/student-grades/${courseId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                studentName: studentInfoResult.rows[0].firstName,
                totalGrade: studentInfoResult.rows[0].totalGrade,
                totalMaxGrade: studentInfoResult.rows[0].totalMaxGrade,
                assignments: assignmentDetailsResult.rows,
            });
        });

        it('should return 500 on database error', async () => {
            const courseId = 1;
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get(`/stu-api/student-grades/${courseId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });
});

