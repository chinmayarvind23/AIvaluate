const request = require('supertest');
const express = require('express');
const router = require('../routes/assignmentRoutes'); // Adjust this path according to your project structure
const { pool } = require('../dbConfig');
const session = require('express-session');
const app = express();

jest.mock('pg', () => {
    const mPool = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

app.use(express.json()); // Ensure JSON bodies are parsed
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
  
beforeEach(() => {
    jest.clearAllMocks();
});

jest.setTimeout(30000);

describe('Assignment Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /assignments', () => {
        it('should create a new assignment', async () => {
            const newAssignment = {
                courseId: 1,
                dueDate: '2024-06-30',
                assignmentKey: 'key1',
                maxObtainableGrade: 100,
                assignmentDescription: 'description'
            };
            const insertResult = { rows: [{ assignmentId: 1 }] };
            pool.query.mockResolvedValueOnce(insertResult);

            const res = await request(app)
                .post('/eval-api/assignments')
                .send(newAssignment);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ assignmentId: 1, message: 'Assignment created successfully' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/assignments')
                .send({
                    courseId: 1,
                    dueDate: '2024-06-30',
                    assignmentKey: 'key1',
                    maxObtainableGrade: 100,
                    assignmentDescription: 'description'
                });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error creating assignment' });
        });
    });

    describe('GET /assignments', () => {
        it('should fetch all assignments', async () => {
            const assignmentsResult = {
                rows: [
                    { assignmentId: 1, courseId: 1, dueDate: '2024-06-30', assignmentKey: 'key1', maxObtainableGrade: 100, assignmentDescription: 'description' }
                ]
            };
            pool.query.mockResolvedValueOnce(assignmentsResult);

            const res = await request(app).get('/eval-api/assignments');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(assignmentsResult.rows);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/assignments');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching assignments' });
        });
    });

    describe('POST /rubrics', () => {
        it('should add a rubric', async () => {
            const newRubric = {
                assignmentId: 1,
                courseId: 1,
                criteria: 'criteria'
            };
            const insertResult = { rows: [{ assignmentId: 1, courseId: 1, criteria: 'criteria' }] };
            pool.query.mockResolvedValueOnce(insertResult);

            const res = await request(app)
                .post('/eval-api/rubrics')
                .send(newRubric);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(insertResult.rows[0]);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/rubrics')
                .send({
                    assignmentId: 1,
                    courseId: 1,
                    criteria: 'criteria'
                });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error adding rubric' });
        });
    });

    describe('POST /assignments/:assignmentId/solutions', () => {
        it('should add a solution', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/eval-api/assignments/1/solutions')
                .send({ solutionFile: 'solution' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Solution added successfully' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post('/eval-api/assignments/1/solutions')
                .send({ solutionFile: 'solution' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error adding solution' });
        });
    });

    describe('GET /assignments/:assignmentId/solutions', () => {
        it('should fetch solution by assignment ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ solutionFile: 'solution' }] });

            const res = await request(app).get('/eval-api/assignments/1/solutions');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ solutionFile: 'solution' });
        });

        it('should return 404 if solution not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app).get('/eval-api/assignments/1/solutions');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Solution not found' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/eval-api/assignments/1/solutions');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching solution' });
        });
    });

    describe('PUT /assignments/:assignmentId/solutions', () => {
        it('should update solution by assignment ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ solutionFile: 'updated_solution' }] });

            const res = await request(app)
                .put('/eval-api/assignments/1/solutions')
                .send({ solutionFile: 'updated_solution' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ solutionFile: 'updated_solution' });
        });

        it('should return 404 if solution not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .put('/eval-api/assignments/1/solutions')
                .send({ solutionFile: 'updated_solution' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Solution not found' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .put('/eval-api/assignments/1/solutions')
                .send({ solutionFile: 'updated_solution' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error updating solution' });
        });
    });

    describe('DELETE /assignments/:assignmentId/solutions', () => {
        it('should delete solution by assignment ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ solutionFile: null }] });

            const res = await request(app).delete('/eval-api/assignments/1/solutions');

            expect(res.status).toBe(204);
            expect(res.body).toEqual({ message: 'Solution deleted successfully' });
        });

        it('should return 404 if solution not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app).delete('/eval-api/assignments/1/solutions');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Solution not found' });
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).delete('/eval-api/assignments/1/solutions');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error deleting solution' });
        });
    });

    describe('GET /rubrics', () => {
        it('should fetch all rubrics', async () => {
            const rubricsResult = { rows: [{ assignmentId: 1, courseId: 1, criteria: 'criteria' }] };
            pool.query.mockResolvedValueOnce(rubricsResult);
    
            const res = await request(app).get('/eval-api/rubrics');
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual(rubricsResult.rows);
        });
    
        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));
    
            const res = await request(app).get('/eval-api/rubrics');
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching rubrics' });
        });
    });
    
    describe('GET /rubrics/:courseId', () => {
        it('should fetch rubrics by course ID', async () => {
            const rubricsResult = { rows: [{ assignmentId: 1, courseId: 1, criteria: 'criteria' }] };
            pool.query.mockResolvedValueOnce(rubricsResult);
    
            const res = await request(app).get('/eval-api/rubrics/1');
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual(rubricsResult.rows);
        });
    
        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));
    
            const res = await request(app).get('/eval-api/rubrics/1');
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching rubrics' });
        });
    });
    
    describe('POST /submissions/:submissionId/grade', () => {
        it('should mark a submission as graded', async () => {
            const submissionResult = { rows: [{ assignmentSubmissionId: 1, isGraded: true }] };
            pool.query.mockResolvedValueOnce(submissionResult);
    
            const res = await request(app)
                .post('/eval-api/submissions/1/grade')
                .send({ isGraded: true });
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Submission marked as graded', submission: { assignmentSubmissionId: 1, isGraded: true } });
        });
    
        it('should return 404 if submission not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });
    
            const res = await request(app)
                .post('/eval-api/submissions/1/grade')
                .send({ isGraded: true });
    
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Submission not found' });
        });
    
        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));
    
            const res = await request(app)
                .post('/eval-api/submissions/1/grade')
                .send({ isGraded: true });
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error marking submission as graded' });
        });
    });
    
    describe('GET /instructors/:instructorId/rubrics', () => {
        it('should fetch rubrics for a specific instructor', async () => {
            const rubricsResult = { rows: [{ assignmentId: 1, courseId: 1, criteria: 'criteria' }] };
            pool.query.mockResolvedValueOnce(rubricsResult);
    
            const res = await request(app).get('/eval-api/instructors/1/rubrics');
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual(rubricsResult.rows);
        });
    
        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));
    
            const res = await request(app).get('/eval-api/instructors/1/rubrics');
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error fetching rubrics' });
        });
    });   
});
