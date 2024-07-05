const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../dbConfig');
const nodemailer = require('nodemailer');
const session = require('express-session');
const router = require('../routes/instructorRoutes'); // Adjust the path to your router file
require('dotenv').config();

jest.mock('nodemailer');
jest.mock('bcryptjs');
jest.mock('../dbConfig', () => {
    const pool = {
        query: jest.fn(),
    };
    return { pool };
});

const app = express();
app.use(express.json());
app.use(session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    req.isAuthenticated = () => true; // Mock isAuthenticated to always return true
    req.user = { instructorId: 1, studentId: 1 }; // Mock user object for testing
    next();
});
app.use('/eval-api', router);

const sendMailMock = jest.fn().mockResolvedValue('Email sent');
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

jest.setTimeout(10000); // Increase timeout to 10 seconds

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /eval-api/forgotpassword', () => {
        it('should send a password reset email', async () => {
            const mockInstructor = {
                instructorId: 1,
                email: 'test@example.com'
            };
            pool.query.mockResolvedValueOnce({ rows: [mockInstructor] });

            const res = await request(app)
                .post('/eval-api/forgotpassword')
                .send({ email: 'test@example.com' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Recovery email sent' });
            expect(sendMailMock).toHaveBeenCalled();
        });

        it('should return 404 if email not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/eval-api/forgotpassword')
                .send({ email: 'test@example.com' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'No account with that email found' });
        });

        it('should return 500 on server error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/forgotpassword')
                .send({ email: 'test@example.com' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Server error' });
        });
    });

    describe('POST /eval-api/reset/:token', () => {
        it('should reset the password', async () => {
            const mockInstructor = {
                instructorId: 1,
                email: 'test@example.com'
            };
            pool.query.mockResolvedValueOnce({ rows: [mockInstructor] });
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');

            const res = await request(app)
                .post('/eval-api/reset/validtoken')
                .send({
                    password: 'newPassword1',
                    confirmPassword: 'newPassword1'
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Password has been reset successfully' });
        });

        it('should return 400 if passwords do not match', async () => {
            const res = await request(app)
                .post('/eval-api/reset/validtoken')
                .send({
                    password: 'newPassword1',
                    confirmPassword: 'differentPassword'
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Passwords do not match' });
        });

        it('should return 400 if password does not meet criteria', async () => {
            const res = await request(app)
                .post('/eval-api/reset/validtoken')
                .send({
                    password: 'short',
                    confirmPassword: 'short'
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Password must be longer than 6 characters and include a combination of letters and numbers' });
        });

        it('should return 400 if token is invalid or expired', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/eval-api/reset/invalidtoken')
                .send({
                    password: 'newPassword1',
                    confirmPassword: 'newPassword1'
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Password reset token is invalid or has expired' });
        });

        it('should return 500 on server error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/reset/validtoken')
                .send({
                    password: 'newPassword1',
                    confirmPassword: 'newPassword1'
                });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Server error' });
        });
    });

    describe('POST /eval-api/teaches', () => {
        it('should add an instructor to a course', async () => {
            pool.query.mockResolvedValueOnce({});

            const res = await request(app)
                .post('/eval-api/teaches')
                .send({
                    courseId: 1,
                    instructorId: 1
                });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: 'Instructor/TA added to course successfully' });
        });

        it('should return 500 on server error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/teaches')
                .send({
                    courseId: 1,
                    instructorId: 1
                });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error adding Instructor/TA to course' });
        });
    });

    describe('POST /eval-api/courses', () => {
        it('should create a new course', async () => {
            const newCourse = {
                courseName: 'Course Name',
                courseCode: 'CSE101',
                maxStudents: 50
            };
            const insertResult = { rows: [{ courseId: 1 }] };
            pool.query.mockResolvedValueOnce(insertResult);

            const res = await request(app)
                .post('/eval-api/courses')
                .send(newCourse);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ courseId: 1, message: 'Course created successfully' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/courses')
                .send({
                    courseName: 'Course Name',
                    courseCode: 'CSE101',
                    maxStudents: 50
                });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error creating course' });
        });
    });

    describe('GET /eval-api/courses', () => {
        it('should fetch all courses', async () => {
            const coursesResult = {
                rows: [
                    { courseId: 1, courseName: 'Course Name', courseCode: 'CSE101', maxStudents: 50 }
                ]
            };
            pool.query.mockResolvedValueOnce(coursesResult);

            const res = await request(app).get('/eval-api/courses');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(coursesResult.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/courses');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching courses' });
        });
    });
});
