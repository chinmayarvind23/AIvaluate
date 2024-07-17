const request = require('supertest');
const express = require('express');
const router = require('../routes/courseRoutes');
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
    req.user = { instructorId: 1 };
    next();
});
app.use('/eval-api', router);

jest.mock('../dbConfig', () => {
    const pool = {
        query: jest.fn(),
    };
    return { pool };
});

describe('Course Archive API Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /eval-api/courses/archived', () => {
        it('should fetch all archived courses', async () => {
            const archivedCourses = {
                rows: [
                    { courseId: 1, courseName: 'Archived Course 1', courseCode: 'AC101', isArchived: true },
                    { courseId: 2, courseName: 'Archived Course 2', courseCode: 'AC102', isArchived: true },
                ],
            };

            pool.query.mockResolvedValueOnce(archivedCourses);

            const res = await request(app).get('/eval-api/courses/archived');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(archivedCourses.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/courses/archived');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching courses' });
        });
    });

    describe('GET /eval-api/courses/active', () => {
        it('should fetch all active courses', async () => {
            const activeCourses = {
                rows: [
                    { courseId: 1, courseName: 'Active Course 1', courseCode: 'AC101', isArchived: false },
                    { courseId: 2, courseName: 'Active Course 2', courseCode: 'AC102', isArchived: false },
                ],
            };

            pool.query.mockResolvedValueOnce(activeCourses);

            const res = await request(app).get('/eval-api/courses/active');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(activeCourses.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/courses/active');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching courses' });
        });
    });

    describe('PUT /eval-api/courses/:courseId/archive', () => {
        it('should archive a course', async () => {
            const courseId = 1;
            const mockResult = { rowCount: 1 };

            pool.query.mockResolvedValueOnce(mockResult);

            const res = await request(app).put(`/eval-api/courses/${courseId}/archive`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Course archived successfully' });
        });

        it('should return 404 if course not found', async () => {
            const courseId = 1;
            const mockResult = { rowCount: 0 };

            pool.query.mockResolvedValueOnce(mockResult);

            const res = await request(app).put(`/eval-api/courses/${courseId}/archive`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Course not found' });
        });

        it('should return 500 on database error', async () => {
            const courseId = 1;
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).put(`/eval-api/courses/${courseId}/archive`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error archiving course' });
        });
    });

    describe('PUT /eval-api/courses/:courseId/unarchive', () => {
        it('should unarchive a course', async () => {
            const courseId = 1;
            const mockResult = { rowCount: 1 };

            pool.query.mockResolvedValueOnce(mockResult);

            const res = await request(app).put(`/eval-api/courses/${courseId}/unarchive`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Course unarchived successfully' });
        });

        it('should return 404 if course not found', async () => {
            const courseId = 1;
            const mockResult = { rowCount: 0 };

            pool.query.mockResolvedValueOnce(mockResult);

            const res = await request(app).put(`/eval-api/courses/${courseId}/unarchive`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Course not found' });
        });

        it('should return 500 on database error', async () => {
            const courseId = 1;
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).put(`/eval-api/courses/${courseId}/unarchive`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error unarchiving course' });
        });
    });

    describe('GET /eval-api/courses/:courseId/is-archived', () => {
        it('should determine if a course is archived', async () => {
            const courseId = 1;
            const mockResult = { rows: [{ isArchived: true }] };

            pool.query.mockResolvedValueOnce(mockResult);

            const res = await request(app).get(`/eval-api/courses/${courseId}/is-archived`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ isArchived: true });
        });

        it('should return 404 if course not found', async () => {
            const courseId = 1;
            const mockResult = { rowCount: 0 };

            pool.query.mockResolvedValueOnce(mockResult);

            const res = await request(app).get(`/eval-api/courses/${courseId}/is-archived`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Course not found' });
        });

        it('should return 500 on database error', async () => {
            const courseId = 1;
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get(`/eval-api/courses/${courseId}/is-archived`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching course' });
        });
    });
});
