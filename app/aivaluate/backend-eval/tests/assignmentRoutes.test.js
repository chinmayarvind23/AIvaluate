const request = require('supertest');
const express = require('express');
const router = require('../routes/assignmentRoutes'); // Adjust the path to your router
const { pool } = require('../dbConfig'); // Adjust the path to your dbConfig

const app = express();
app.use(express.json());
app.use('/api', router); // Adjust the route prefix if needed

jest.mock('../dbConfig'); // Mock the dbConfig

describe('Assignments API', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mocks
    });

    describe('POST /assignments', () => {
        it('should create a new assignment and rubric', async () => {
            const mockAssignmentId = 1;
            const mockRubricId = 1;
            const newAssignment = {
                courseId: 1,
                dueDate: '2024-06-28T00:00:00.000Z',
                assignmentName: 'New Assignment',
                maxObtainableGrade: 100,
                rubricName: 'New Rubric',
                criteria: '',
                assignmentKey: 'assignmentKey123'
            };

            pool.query
                .mockResolvedValueOnce({ rows: [{ assignmentId: mockAssignmentId }] })
                .mockResolvedValueOnce({ rows: [{ assignmentRubricId: mockRubricId }] })
                .mockResolvedValueOnce({ rows: [] });

            const res = await request(app).post('/api/assignments').send(newAssignment);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({
                assignmentId: mockAssignmentId,
                assignmentRubricId: mockRubricId,
                message: 'Assignment and rubric created successfully'
            });
        });

        it('should handle errors during creation', async () => {
            pool.query.mockRejectedValue(new Error('DB error'));

            const res = await request(app).post('/api/assignments').send({});

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({ message: 'Error creating assignment and rubric' });
        });
    });

    describe('GET /assignments', () => {
        it('should get all assignments', async () => {
            const mockAssignments = [
                { assignmentName: 'Assignment 1', dueDate: '2024-06-28T00:00:00.000Z', isPublished: true, criteria: '' }
            ];

            pool.query.mockResolvedValue({ rows: mockAssignments });

            const res = await request(app).get('/api/assignments');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockAssignments);
        });

        it('should handle errors when fetching assignments', async () => {
            pool.query.mockRejectedValue(new Error('DB error'));

            const res = await request(app).get('/api/assignments');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({ message: 'Error fetching assignments' });
        });
    });

    describe('GET /assignments/:assignmentId', () => {
        it('should fetch an assignment by ID', async () => {
            const mockAssignment = {
                assignmentName: 'Assignment 1',
                dueDate: '2024-06-28T00:00:00.000Z',
                isPublished: true,
                criteria: ''
            };

            pool.query.mockResolvedValue({ rows: [mockAssignment] });

            const res = await request(app).get('/api/assignments/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockAssignment);
        });

        it('should return 404 if assignment not found', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const res = await request(app).get('/api/assignments/999');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual({ message: 'Assignment not found' });
        });
    });

    describe('PUT /assignments/:assignmentId/toggle-publish', () => {
        it('should toggle the publish status of an assignment', async () => {
            const mockAssignment = {
                assignmentId: 1,
                assignmentName: 'Assignment 1',
                dueDate: '2024-06-28T00:00:00.000Z',
                isPublished: true
            };

            pool.query
                .mockResolvedValueOnce({ rows: [{ isPublished: true }] })
                .mockResolvedValueOnce({ rows: [mockAssignment] });

            const res = await request(app).put('/api/assignments/1/toggle-publish');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                message: 'Assignment publish status updated successfully',
                assignment: mockAssignment
            });
        });

        it('should return 404 if assignment not found', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const res = await request(app).put('/api/assignments/999/toggle-publish');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual({ message: 'Assignment not found' });
        });
    });

    // Additional tests for other routes
});
