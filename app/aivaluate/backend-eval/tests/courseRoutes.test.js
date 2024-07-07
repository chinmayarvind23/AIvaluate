const request = require('supertest');
const express = require('express');
const router = require('../routes/courseRoutes'); // Adjust the path to your router file
const { pool } = require('../dbConfig');
const session = require('express-session');

jest.mock('pg', () => {
    const mPool = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
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

  
beforeEach(() => {
    jest.clearAllMocks();
});

jest.setTimeout(30000); // Increase timeout to 10 seconds

describe('Course Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /courses', () => {
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

    describe('GET /courses', () => {
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

    describe('GET /enrolled-courses', () => {
        it('should fetch courses enrolled by instructor', async () => {
            const enrolledCoursesResult = {
                rows: [
                    { courseId: 1, courseCode: 'CSE101', courseName: 'Course Name' }
                ]
            };
            pool.query.mockResolvedValueOnce(enrolledCoursesResult);

            const res = await request(app).get('/eval-api/enrolled-courses');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(enrolledCoursesResult.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/enrolled-courses');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /courses/:id', () => {
        it('should fetch a single course by ID', async () => {
            const courseResult = {
                rows: [
                    { courseId: 1, courseName: 'Course Name', courseCode: 'CSE101', maxStudents: 50 }
                ]
            };
            pool.query.mockResolvedValueOnce(courseResult);

            const res = await request(app).get('/eval-api/courses/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(courseResult.rows[0]);
        });

        it('should return 404 if course not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

            const res = await request(app).get('/eval-api/courses/1');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Course not found' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/courses/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching course' });
        });
    });

    describe('DELETE /courses/:id', () => {
        it('should delete a course', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const res = await request(app).delete('/eval-api/courses/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Course deleted successfully' });
        });

        it('should return 404 if course not found', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });

            const res = await request(app).delete('/eval-api/courses/1');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Course not found' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).delete('/eval-api/courses/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error deleting course' });
        });
    });

    describe('PUT /courses/:id', () => {
        it('should update a course', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const updatedCourse = {
                courseName: 'Updated Course Name',
                courseCode: 'CSE102',
                maxStudents: 60
            };

            const res = await request(app)
                .put('/eval-api/courses/1')
                .send(updatedCourse);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Course updated successfully' });
        });

        it('should return 404 if course not found', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });

            const updatedCourse = {
                courseName: 'Updated Course Name',
                courseCode: 'CSE102',
                maxStudents: 60
            };

            const res = await request(app)
                .put('/eval-api/courses/1')
                .send(updatedCourse);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Course not found' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const updatedCourse = {
                courseName: 'Updated Course Name',
                courseCode: 'CSE102',
                maxStudents: 60
            };

            const res = await request(app)
                .put('/eval-api/courses/1')
                .send(updatedCourse);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error updating course' });
        });
    });

    describe('GET /courses/:courseId/submissions', () => {
        it('should fetch submissions for a course', async () => {
            const submissionsResult = {
                rows: [
                    {
                        assignmentSubmissionId: 1,
                        studentId: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        assignmentKey: 'key1',
                        isGraded: true
                    }
                ]
            };
            pool.query.mockResolvedValueOnce(submissionsResult);

            const res = await request(app).get('/eval-api/courses/1/submissions');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(submissionsResult.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/courses/1/submissions');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching submissions' });
        });
    });

    describe('GET /instructors/:instructorId/courses', () => {
        it('should fetch courses for an instructor', async () => {
            const instructorCoursesResult = {
                rows: [
                    { courseId: 1, courseName: 'Course Name', courseCode: 'CSE101' }
                ]
            };
            pool.query.mockResolvedValueOnce(instructorCoursesResult);

            const res = await request(app).get('/eval-api/instructors/1/courses');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(instructorCoursesResult.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/instructors/1/courses');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching courses' });
        });
    });

    describe('GET /instructors/:instructorId/courses', () => {
        it('should fetch courses for an instructor', async () => {
            const instructorCoursesResult = {
                rows: [
                    { courseId: 1, courseName: 'Course Name', courseCode: 'CSE101' }
                ]
            };
            pool.query.mockResolvedValueOnce(instructorCoursesResult);
    
            const res = await request(app).get('/eval-api/instructors/1/courses');
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual(instructorCoursesResult.rows);
        });
    
        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));
    
            const res = await request(app).get('/eval-api/instructors/1/courses');
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching courses' });
        });
    });
    
    describe('GET /courses/:courseId/submissions', () => {
        it('should fetch all submissions for a course', async () => {
            const submissionsResult = {
                rows: [
                    { assignmentSubmissionId: 1, studentId: 1, firstName: 'John', lastName: 'Doe', assignmentKey: 'key1', isGraded: true }
                ]
            };
            pool.query.mockResolvedValueOnce(submissionsResult);
    
            const res = await request(app).get('/eval-api/courses/1/submissions');
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual(submissionsResult.rows);
        });
    
        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));
    
            const res = await request(app).get('/eval-api/courses/1/submissions');
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching submissions' });
        });
    });    
});
