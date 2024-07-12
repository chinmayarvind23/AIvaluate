const request = require('supertest');
const express = require('express');
const router = require('../routes'); // Adjust the path as needed
const { pool } = require('../dbConfig');
const { formatDueDate } = require('../util');

jest.mock('../dbConfig');
jest.mock('../util');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.session = { instructorId: 1, courseId: 1, assignmentId: 1 }; // Mock session data
    next();
});
app.use(router);

describe('Assignments API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests for /assignments route
    test('POST /assignments should create a new assignment', async () => {
        const mockAssignment = {
            dueDate: '2023-07-30',
            assignmentName: 'Test Assignment',
            assignmentDescription: 'Description',
            maxObtainableGrade: 100,
            rubricName: 'Test Rubric',
            criteria: 'Criteria'
        };
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1 }] });
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentRubricId: 1 }] });
        pool.query.mockResolvedValueOnce({});

        const response = await request(app)
            .post('/assignments')
            .send(mockAssignment);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ assignmentId: 1, assignmentRubricId: 1, message: 'Assignment and rubric created successfully' });
    });

    test('GET /assignments/:assignmentId should return the assignment with the given ID', async () => {
        const mockAssignment = {
            assignmentName: 'Test Assignment',
            dueDate: '2023-07-30',
            assignmentDescription: 'Description',
            isPublished: false,
            criteria: 'Criteria'
        };
        pool.query.mockResolvedValueOnce({ rows: [mockAssignment] });

        const response = await request(app).get('/assignments/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignment);
    });

    test('GET /assignments should return all assignments', async () => {
        const mockAssignments = [
            { assignmentId: 1, courseId: 1, dueDate: '2023-07-30', assignmentName: 'Assignment 1', assignmentDescription: 'Description 1', maxObtainableGrade: 100 },
            { assignmentId: 2, courseId: 1, dueDate: '2023-08-01', assignmentName: 'Assignment 2', assignmentDescription: 'Description 2', maxObtainableGrade: 50 }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockAssignments });

        const response = await request(app).get('/assignments');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignments);
    });

    // Tests for /rubrics route
    test('GET /rubrics should return all rubrics', async () => {
        const mockRubrics = [
            { assignmentRubricId: 1, assignmentId: 1, courseId: 1, criteria: 'Criteria 1' },
            { assignmentRubricId: 2, assignmentId: 2, courseId: 1, criteria: 'Criteria 2' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockRubrics });

        const response = await request(app).get('/rubrics');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRubrics);
    });

    test('POST /rubrics should create a new rubric', async () => {
        const mockRubric = { assignmentId: 1, courseId: 1, criteria: 'New Criteria' };
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentRubricId: 1, ...mockRubric }] });

        const response = await request(app)
            .post('/rubrics')
            .send(mockRubric);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ assignmentRubricId: 1, ...mockRubric });
    });

    test('PUT /rubric/:rubricId should update the rubric with the given ID', async () => {
        const mockUpdatedRubric = { assignmentRubricId: 1, rubricName: 'Updated Rubric', criteria: 'Updated Criteria' };
        pool.query.mockResolvedValueOnce({ rows: [mockUpdatedRubric] });

        const response = await request(app)
            .put('/rubric/1')
            .send(mockUpdatedRubric);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedRubric);
    });

    test('GET /rubric/:rubricId should return the rubric with the given ID', async () => {
        const mockRubric = { assignmentRubricId: 1, rubricName: 'Rubric 1', criteria: 'Criteria' };
        pool.query.mockResolvedValueOnce({ rows: [mockRubric] });

        const response = await request(app).get('/rubric/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockRubric]);
    });

    // Tests for /assignments/:assignmentId/solutions route
    test('POST /assignments/:assignmentId/solutions should add or update the solution', async () => {
        const mockSolution = { assignmentKey: 'path/to/solution' };
        pool.query.mockResolvedValueOnce({ rows: [mockSolution] });

        const response = await request(app)
            .post('/assignments/1/solutions')
            .send({ instructorId: 1 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Solution added or updated successfully');
    });

    test('GET /assignments/:assignmentId/solutions should return the solution for the given assignment ID', async () => {
        const mockSolution = { assignmentKey: 'path/to/solution' };
        pool.query.mockResolvedValueOnce({ rows: [mockSolution] });

        const response = await request(app).get('/assignments/1/solutions');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSolution);
    });

    test('PUT /assignments/:assignmentId/solutions should update the solution for the given assignment ID', async () => {
        const mockUpdatedSolution = { assignmentKey: 'updated/path/to/solution' };
        pool.query.mockResolvedValueOnce({ rows: [mockUpdatedSolution] });

        const response = await request(app)
            .put('/assignments/1/solutions')
            .send({ assignmentKey: 'updated/path/to/solution' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedSolution);
    });

    test('DELETE /assignments/:assignmentId/solutions should delete the solution for the given assignment ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1, assignmentKey: null }] });

        const response = await request(app).delete('/assignments/1/solutions');

        expect(response.status).toBe(204);
    });

    // Tests for /submissions/:submissionId/grade route
    test('POST /submissions/:submissionId/grade should mark the submission as graded', async () => {
        const mockSubmission = { assignmentSubmissionId: 1, isGraded: true };
        pool.query.mockResolvedValueOnce({ rows: [mockSubmission] });

        const response = await request(app).post('/submissions/1/grade');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Submission marked as graded');
    });

    // Tests for /assignments/:assignmentId/submissions route
    test('GET /assignments/:assignmentId/submissions should fetch submissions by assignment ID', async () => {
        const mockSubmissions = [
            { assignmentSubmissionId: 1, assignmentId: 1, studentId: 1, submissionFile: 'file1.js' },
            { assignmentSubmissionId: 2, assignmentId: 1, studentId: 2, submissionFile: 'file2.js' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockSubmissions });

        const response = await request(app).get('/assignments/1/submissions');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSubmissions);
    });

    // Tests for /instructors/:instructorId/rubrics route
    test('GET /instructors/:instructorId/rubrics should fetch rubrics for a specific instructor', async () => {
        const mockRubrics = [
            { assignmentRubricId: 1, assignmentId: 1, instructorId: 1, criteria: 'Criteria 1' },
            { assignmentRubricId: 2, assignmentId: 2, instructorId: 1, criteria: 'Criteria 2' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockRubrics });

        const response = await request(app).get('/instructors/1/rubrics');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRubrics);
    });

    // Tests for /rubrics/:courseId route
    test('GET /rubrics/:courseId should fetch rubrics by courseId', async () => {
        const mockRubrics = [
            { assignmentRubricId: 1, assignmentId: 1, courseId: 1, criteria: 'Criteria 1' },
            { assignmentRubricId: 2, assignmentId: 2, courseId: 1, criteria: 'Criteria 2' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockRubrics });

        const response = await request(app).get('/rubrics/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRubrics);
    });

    // Tests for /assignments/course/:courseId route
    test('GET /assignments/course/:courseId should fetch published assignments by course ID', async () => {
        const mockAssignments = [
            { assignmentId: 1, courseId: 1, dueDate: '2023-07-30', assignmentName: 'Assignment 1', isPublished: true }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockAssignments });
        formatDueDate.mockReturnValue('formatted date');

        const response = await request(app).get('/assignments/course/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignments.map(assignment => ({
            ...assignment,
            dueDate: 'formatted date'
        })));
    });

    // Tests for /assignments/course/:courseId/all route
    test('GET /assignments/course/:courseId/all should fetch all assignments by course ID', async () => {
        const mockAssignments = [
            { assignmentId: 1, courseId: 1, dueDate: '2023-07-30', assignmentName: 'Assignment 1' },
            { assignmentId: 2, courseId: 1, dueDate: '2023-08-01', assignmentName: 'Assignment 2' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockAssignments });
        formatDueDate.mockReturnValue('formatted date');

        const response = await request(app).get('/assignments/course/1/all');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignments.map(assignment => ({
            ...assignment,
            dueDate: 'formatted date'
        })));
    });

    // Tests for /assignments/count/:courseId route
    test('GET /assignments/count/:courseId should count published assignments by course ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ count: '2' }] });

        const response = await request(app).get('/assignments/count/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ totalAssignments: 2 });
    });

    // Tests for /assignments/count/:courseId/all route
    test('GET /assignments/count/:courseId/all should count all assignments by course ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ count: '5' }] });

        const response = await request(app).get('/assignments/count/1/all');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ totalAssignments: 5 });
    });

    // Tests for /assignments/:assignmentId/toggle-publish route
    test('PUT /assignments/:assignmentId/toggle-publish should toggle the publish status of the assignment', async () => {
        const mockAssignment = { assignmentId: 1, isPublished: false };
        pool.query.mockResolvedValueOnce({ rows: [mockAssignment] });
        pool.query.mockResolvedValueOnce({ rows: [{ ...mockAssignment, isPublished: !mockAssignment.isPublished }] });

        const response = await request(app).put('/assignments/1/toggle-publish');

        expect(response.status).toBe(200);
        expect(response.body.assignment.isPublished).toBe(true);
    });

    // Tests for /assignments/:assignmentId/isPublished route
    test('GET /assignments/:assignmentId/isPublished should check if the assignment is published', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ isPublished: true }] });

        const response = await request(app).get('/assignments/1/isPublished');

        expect(response.status).toBe(200);
        expect(response.body.isPublished).toBe(true);
    });

    // Tests for /assignments/:assignmentId/publish route
    test('PUT /assignments/:assignmentId/publish should publish the assignment', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1, isPublished: true }] });

        const response = await request(app).put('/assignments/1/publish');

        expect(response.status).toBe(200);
        expect(response.body.assignment.isPublished).toBe(true);
    });

    // Tests for /assignments/:assignmentId/unpublish route
    test('PUT /assignments/:assignmentId/unpublish should unpublish the assignment', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1, isPublished: false }] });

        const response = await request(app).put('/assignments/1/unpublish');

        expect(response.status).toBe(200);
        expect(response.body.assignment.isPublished).toBe(false);
    });

    // Tests for /upload/:courseId/:assignmentId route (Simplified for brevity)
    test('POST /upload/:courseId/:assignmentId should upload files for the assignment', async () => {
        jest.mock('multer', () => {
            const multer = jest.requireActual('multer');
            return {
                diskStorage: () => ({
                    _handleFile: jest.fn((req, file, cb) => cb(null, { path: `/fake/path/${file.originalname}`, filename: file.originalname })),
                    _removeFile: jest.fn()
                }),
                single: () => (req, res, next) => next()
            };
        });

        const multer = require('multer');
        const { storage } = multer.diskStorage();
        const fileHandler = multer.single('assignmentKey');

        const mockFiles = [
            { path: '/fake/path/file1.js', originalname: 'file1.js', filename: 'file1.js' }
        ];

        pool.query.mockResolvedValueOnce({ rows: [{ assignmentSubmissionId: 1 }] });

        const response = await request(app)
            .post('/upload/1/1')
            .attach('assignmentKey', mockFiles[0].path, mockFiles[0].originalname);

        expect(response.status).toBe(200);
    });

});