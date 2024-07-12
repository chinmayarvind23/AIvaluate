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
    req.session = { studentId: 1 }; // Mock session data
    next();
});
app.use(router);

describe('Assignments API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /assignments should create a new assignment', async () => {
        const mockAssignment = {
            courseId: 1,
            dueDate: '2023-07-30',
            assignmentKey: 'key123',
            maxObtainableGrade: 100,
            assignmentDescription: 'Test description'
        };
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1 }] });

        const response = await request(app)
            .post('/assignments')
            .send(mockAssignment);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ assignmentId: 1, message: 'Assignment created successfully' });
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription") VALUES ($1, $2, $3, $4, $5) RETURNING "assignmentId"',
            [mockAssignment.courseId, mockAssignment.dueDate, mockAssignment.assignmentKey, mockAssignment.maxObtainableGrade, mockAssignment.assignmentDescription]
        );
    });

    test('GET /assignments should return all assignments', async () => {
        const mockAssignments = [
            { assignmentId: 1, courseId: 1, dueDate: '2023-07-30', assignmentKey: 'key123', maxObtainableGrade: 100, assignmentDescription: 'Test description' },
            { assignmentId: 2, courseId: 2, dueDate: '2023-08-01', assignmentKey: 'key124', maxObtainableGrade: 50, assignmentDescription: 'Another description' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockAssignments });

        const response = await request(app).get('/assignments');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignments);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Assignment"');
    });

    test('GET /assignments/:assignmentId should return the assignment with the given ID', async () => {
        const mockAssignment = { assignmentId: 1, courseId: 1, dueDate: '2023-07-30', assignmentKey: 'key123', maxObtainableGrade: 100, assignmentDescription: 'Test description' };
        pool.query.mockResolvedValueOnce({ rows: [mockAssignment] });

        const response = await request(app).get('/assignments/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignment);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Assignment" WHERE "assignmentId" = $1', [1]);
    });

    test('GET /assignments/course/:courseId should return assignments for the given course ID', async () => {
        const mockAssignments = [
            { assignmentId: 1, courseId: 1, dueDate: '2023-07-30', assignmentKey: 'key123', maxObtainableGrade: 100, assignmentDescription: 'Test description' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockAssignments });
        formatDueDate.mockReturnValue('formatted date');

        const response = await request(app).get('/assignments/course/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockAssignments.map(assignment => ({
            ...assignment,
            dueDate: 'formatted date'
        })));
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Assignment" WHERE "courseId" = $1', [1]);
    });

    test('PUT /assignments/:assignmentId should update the assignment with the given ID', async () => {
        const mockUpdatedAssignment = {
            assignmentId: 1,
            courseId: 1,
            dueDate: '2023-07-30',
            assignmentKey: 'key123',
            maxObtainableGrade: 100,
            assignmentDescription: 'Updated description'
        };
        pool.query.mockResolvedValueOnce({ rows: [mockUpdatedAssignment] });

        const response = await request(app)
            .put('/assignments/1')
            .send(mockUpdatedAssignment);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedAssignment);
        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "Assignment" SET "courseId" = $1, "dueDate" = $2, "assignmentKey" = $3, "maxObtainableGrade" = $4, "assignmentDescription" = $5 WHERE "assignmentId" = $6 RETURNING *',
            [mockUpdatedAssignment.courseId, mockUpdatedAssignment.dueDate, mockUpdatedAssignment.assignmentKey, mockUpdatedAssignment.maxObtainableGrade, mockUpdatedAssignment.assignmentDescription, 1]
        );
    });

    test('DELETE /assignments/:assignmentId should delete the assignment with the given ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1 }] });

        const response = await request(app).delete('/assignments/1');

        expect(response.status).toBe(204);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM "Assignment" WHERE "assignmentId" = $1 RETURNING *', [1]);
    });

    test('GET /rubrics should return all rubrics', async () => {
        const mockRubrics = [
            { assignmentRubricId: 1, assignmentId: 1, courseId: 1, criteria: 'Criteria 1' },
            { assignmentRubricId: 2, assignmentId: 2, courseId: 2, criteria: 'Criteria 2' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockRubrics });

        const response = await request(app).get('/rubrics');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRubrics);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "AssignmentRubric"');
    });

    test('POST /rubrics should create a new rubric', async () => {
        const mockRubric = { assignmentId: 1, courseId: 1, criteria: 'New Criteria' };
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentRubricId: 1, ...mockRubric }] });

        const response = await request(app)
            .post('/rubrics')
            .send(mockRubric);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ assignmentRubricId: 1, ...mockRubric });
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO "AssignmentRubric" ("assignmentId", "courseId", "criteria") VALUES ($1, $2, $3) RETURNING *',
            [mockRubric.assignmentId, mockRubric.courseId, mockRubric.criteria]
        );
    });

    test('PUT /rubrics/:rubricId should update the rubric with the given ID', async () => {
        const mockUpdatedRubric = { assignmentRubricId: 1, assignmentId: 1, courseId: 1, criteria: 'Updated Criteria' };
        pool.query.mockResolvedValueOnce({ rows: [mockUpdatedRubric] });

        const response = await request(app)
            .put('/rubrics/1')
            .send(mockUpdatedRubric);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedRubric);
        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "AssignmentRubric" SET "assignmentId" = $1, "courseId" = $2, "criteria" = $3 WHERE "assignmentRubricId" = $4 RETURNING *',
            [mockUpdatedRubric.assignmentId, mockUpdatedRubric.courseId, mockUpdatedRubric.criteria, 1]
        );
    });

    test('DELETE /rubrics/:rubricId should delete the rubric with the given ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentRubricId: 1 }] });

        const response = await request(app).delete('/rubrics/1');

        expect(response.status).toBe(204);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM "AssignmentRubric" WHERE "assignmentRubricId" = $1 RETURNING *', [1]);
    });

    test('GET /assignments/:assignmentId/solutions should return the solution for the given assignment ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentKey: 'key123' }] });

        const response = await request(app).get('/assignments/1/solutions');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ assignmentKey: 'key123' });
        expect(pool.query).toHaveBeenCalledWith('SELECT "assignmentKey" FROM "Assignment" WHERE "assignmentId" = $1', [1]);
    });

    test('PUT /assignments/:assignmentId/solutions should update the solution for the given assignment ID', async () => {
        const mockUpdatedSolution = { assignmentId: 1, assignmentKey: 'updatedKey123' };
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1, assignmentKey: 'updatedKey123' }] });

        const response = await request(app)
            .put('/assignments/1/solutions')
            .send({ assignmentKey: 'updatedKey123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedSolution);
        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "Assignment" SET "assignmentKey" = $1 WHERE "assignmentId" = $2 RETURNING *',
            ['updatedKey123', 1]
        );
    });

    test('DELETE /assignments/:assignmentId/solutions should delete the solution for the given assignment ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ assignmentId: 1, assignmentKey: null }] });

        const response = await request(app).delete('/assignments/1/solutions');

        expect(response.status).toBe(204);
        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "Assignment" SET "assignmentKey" = NULL WHERE "assignmentId" = $1 RETURNING *',
            [1]
        );
    });

    test('GET /assignment/:courseId/:assignmentId should return the assignment details for the student', async () => {
        const mockAssignmentDetails = {
            assignmentName: 'Assignment 1',
            rubricName: 'Rubric 1',
            criteria: 'Criteria 1',
            dueDate: '2023-07-30',
            maxObtainableGrade: 100,
            InstructorAssignedFinalGrade: 'A'
        };
        pool.query.mockResolvedValueOnce({ rows: [mockAssignmentDetails] });

        const response = await request(app).get('/assignment/1/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...mockAssignmentDetails, InstructorAssignedFinalGrade: 'A' });
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT'), // SQL string
            [1, 1, 1] // Parameters
        );
    });

    test('POST /upload/:courseId/:assignmentId should upload files for the assignment', async () => {
        // Mock multer storage and file handling
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
        const fileHandler = multer.single('files');

        const mockFiles = [
            { path: '/fake/path/file1.js', originalname: 'file1.js', filename: 'file1.js' }
        ];

        pool.query.mockResolvedValueOnce({ rows: [{ assignmentSubmissionId: 1 }] });

        const response = await request(app)
            .post('/upload/1/1')
            .attach('files', mockFiles[0].path, mockFiles[0].originalname);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Files uploaded and paths saved successfully');
        expect(pool.query).toHaveBeenCalled();
    });

    test('GET /submission/:courseId/:assignmentId should return the submissions for the student', async () => {
        const mockSubmissions = [
            { assignmentSubmissionId: 1, submissionFile: 'file1.js,file2.js' }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockSubmissions });

        const response = await request(app).get('/submission/1/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSubmissions.map(submission => ({
            assignmentSubmissionId: submission.assignmentSubmissionId,
            files: submission.submissionFile.split(',')
        })));
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT "assignmentSubmissionId", "submissionFile" FROM "AssignmentSubmission" WHERE "studentId" = $1 AND "courseId" = $2 AND "assignmentId" = $3',
            [1, 1, 1]
        );
    });
});