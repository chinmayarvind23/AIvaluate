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
    next();
});
app.use('/eval-api', router);

jest.mock('../dbConfig', () => {
    const pool = {
        query: jest.fn(),
    };
    return { pool };
});

describe('Evaluator Grades Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /eval-api/evaluator-grades/:courseId', () => {
        it('should fetch assignment details for a course ordered by due date', async () => {
            const courseId = 1;
            const assignmentDetailsResult = {
                rows: [
                    {
                        name: 'assignment1',
                        due: '2022-01-15',
                        avgGrade: 95,
                        totalGrade: 100,
                    },
                    {
                        name: 'assignment2',
                        due: '2022-02-10',
                        avgGrade: 90,
                        totalGrade: 100,
                    },
                ],
            };

            pool.query.mockResolvedValueOnce(assignmentDetailsResult);

            const res = await request(app).get(`/eval-api/evaluator-grades/${courseId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(assignmentDetailsResult.rows);
        });

        it('should return 500 on database error', async () => {
            const courseId = 1;
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get(`/eval-api/evaluator-grades/${courseId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });
});

