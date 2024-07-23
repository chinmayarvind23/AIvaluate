const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const { formatDueDate } = require('../util');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const openai = require('openai');
const baseDirSubmissions = path.resolve('/app/aivaluate/backend/assignmentSubmissions');
const baseDirKeys = path.resolve('/app/aivaluate/backend/assignmentKeys');
router.use(bodyParser.json());
const openaiApiKey = process.env.OPENAI_API_KEY;

// Function to create directory structure and store file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const courseId = req.session.courseId;
        const instructorId = req.session.instructorId;
        const assignmentId = req.session.assignmentId;

        if (!instructorId) {
            console.error('Instructor ID not found in session');
            return cb(new Error('Instructor ID not found in session'), false);
        }

        if (!assignmentId) {
            console.error('Assignment ID not found in session');
            return cb(new Error('Assignment ID not found in session'), false);
        }

        try {
            const dir = path.resolve(__dirname, `../assignmentKeys/${courseId}/${instructorId}/${assignmentId}`);
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } catch (err) {
            console.error('Error creating directory:', err);
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/eval-api/login');
}

// router.post('/assignments', async (req, res) => {
//     const { courseId, dueDate, assignmentName, maxObtainableGrade, rubricName, criteria, assignmentKey } = req.body;
//         try {
//             const dir = path.resolve(__dirname, `../assignmentKeys/${courseId}/${instructorId}/${assignmentId}`);
//             fs.mkdirSync(dir, { recursive: true });
//             cb(null, dir);
//         } catch (err) {
//             console.error('Error creating directory:', err);
//             cb(err);
//         }
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// Create a new assignment
router.post('/assignments', upload.single('assignmentKey'), async (req, res) => {
    const { dueDate, assignmentName, assignmentDescription, maxObtainableGrade, rubricName, criteria } = req.body;
    const instructorId = req.session.instructorId;
    const courseId = req.session.courseId;
    const assignmentKey = req.file ? req.file.path : null;

    console.log('Received request body:', req.body);
    console.log('Received file info:', req.file);
    console.log('Instructor ID from session:', instructorId);
    console.log('Course ID from session:', courseId);

    if (!instructorId) {
        return res.status(400).json({ message: 'Instructor ID not found in session' });
    }

    if (!courseId || !dueDate || !assignmentName || !maxObtainableGrade || !rubricName || !criteria) {
        console.error('Missing required fields in request body');
        return res.status(400).json({ message: 'Missing required fields in request body' });
    }

    try {
        await pool.query('BEGIN');

        const assignmentResult = await pool.query(
            'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentName", "assignmentDescription", "maxObtainableGrade", "assignmentKey") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "assignmentId"',
            [courseId, dueDate, assignmentName, assignmentDescription, maxObtainableGrade, assignmentKey]
        );

        const assignmentId = assignmentResult.rows[0].assignmentId;
        req.session.assignmentId = assignmentId;

        const rubricResult = await pool.query(
            'INSERT INTO "AssignmentRubric" ("rubricName", "criteria", "courseId") VALUES ($1, $2, $3) RETURNING "assignmentRubricId"',
            [rubricName, criteria, courseId]
        );

        const assignmentRubricId = rubricResult.rows[0].assignmentRubricId;

        await pool.query(
            'INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId") VALUES ($1, $2)',
            [assignmentId, assignmentRubricId]
        );

        await pool.query('COMMIT');

        res.status(201).json({ assignmentId, assignmentRubricId, message: 'Assignment and rubric created successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating assignment and rubric:', error);
        res.status(500).json({ message: 'Error creating assignment and rubric' });
    }
});

// Get assignment by assignment ID
router.get('/assignments/:assignmentId', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            `SELECT a."assignmentName", a."dueDate", a."assignmentDescription", a."isPublished", ar."criteria" 
             FROM "Assignment" a 
             LEFT JOIN "useRubric" ur ON a."assignmentId" = ur."assignmentId" 
             LEFT JOIN "AssignmentRubric" ar ON ur."assignmentRubricId" = ar."assignmentRubricId" 
             WHERE a."assignmentId" = $1`,
            [assignmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        let assignment = result.rows[0];

        if (!assignment.criteria) {
            const rubricResult = await pool.query(
                'INSERT INTO "AssignmentRubric" ("rubricName", "criteria", "courseId") VALUES ($1, $2, $3) RETURNING "assignmentRubricId"',
                [assignment.assignmentName, '', assignment.courseId]
            );

            const assignmentRubricId = rubricResult.rows[0].assignmentRubricId;

            await pool.query(
                'INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId") VALUES ($1, $2)',
                [assignmentId, assignmentRubricId]
            );

            const updatedResult = await pool.query(
                `SELECT a."assignmentName", a."dueDate", a."assignmentDescription", a."isPublished", ar."criteria" 
                 FROM "Assignment" a 
                 JOIN "useRubric" ur ON a."assignmentId" = ur."assignmentId" 
                 JOIN "AssignmentRubric" ar ON ur."assignmentRubricId" = ar."assignmentRubricId" 
                 WHERE a."assignmentId" = $1`,
                [assignmentId]
            );

            assignment = updatedResult.rows[0];
        }

        res.status(200).json(assignment);
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({ message: 'Error fetching assignment' });
    }
});

// Get all assignments
router.get('/assignments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Assignment"');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

// Fetch rubrics
router.get('/rubrics', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "AssignmentRubric"');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching rubrics:', error);
        res.status(500).json({ message: 'Error fetching rubrics' });
    }
});

// Add a rubric
router.post('/rubrics', async (req, res) => {
    const { assignmentId, courseId, criteria } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO "AssignmentRubric" ("assignmentId", "courseId", "criteria") VALUES ($1, $2, $3) RETURNING *',
            [assignmentId, courseId, criteria]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding rubric:', error);
        res.status(500).json({ message: 'Error adding rubric' });
    }
});

// Add or update a solution
router.post('/assignments/:assignmentId/solutions', upload.single('assignmentKey'), async (req, res) => {
    const { assignmentId } = req.params;
    const { instructorId } = req.body;
    const assignmentKey = req.file ? req.file.path : null;

    if (!instructorId) {
        return res.status(400).json({ message: 'Instructor ID is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE "Assignment" SET "assignmentKey" = $1 WHERE "assignmentId" = $2 RETURNING *',
            [assignmentKey, assignmentId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Solution added or updated successfully', assignment: result.rows[0] });
    } catch (error) {
        console.error('Error adding or updating solution:', error);
        res.status(500).json({ message: 'Error adding or updating solution' });
    }
});

// Get solution by assignment ID
router.get('/assignments/:assignmentId/solutions', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query('SELECT "assignmentKey" FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Solution not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching solution:', error);
        res.status(500).json({ message: 'Error fetching solution' });
    }
});

// Update solution by assignment ID
router.put('/assignments/:assignmentId/solutions', async (req, res) => {
    const { assignmentId } = req.params;
    const { assignmentKey } = req.body;

    try {
        const result = await pool.query(
            'UPDATE "Assignment" SET "assignmentKey" = $1 WHERE "assignmentId" = $2 RETURNING *',
            [assignmentKey, assignmentId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Solution not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating solution:', error);
        res.status(500).json({ message: 'Error updating solution' });
    }
});

// Delete solution by assignment ID
router.delete('/assignments/:assignmentId/solutions', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            'UPDATE "Assignment" SET "assignmentKey" = NULL WHERE "assignmentId" = $1 RETURNING *',
            [assignmentId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Solution not found' });
        }
        res.status(204).json({ message: 'Solution deleted successfully' });
    } catch (error) {
        console.error('Error deleting solution:', error);
        res.status(500).json({ message: 'Error deleting solution' });
    }
});

// Mark a submission as graded
router.post('/submissions/:submissionId/grade', async (req, res) => {
    const { submissionId } = req.params;

    try {
        const result = await pool.query(
            'UPDATE "AssignmentSubmission" SET "isGraded" = true WHERE "assignmentSubmissionId" = $1 RETURNING *',
            [submissionId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json({ message: 'Submission marked as graded', submission: result.rows[0] });
    } catch (error) {
        console.error('Error marking submission as graded:', error);
        res.status(500).json({ message: 'Error marking submission as graded' });
    }
});

// Fetch submissions by assignment ID
router.get('/assignments/:assignmentId/submissions', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "AssignmentSubmission" WHERE "assignmentId" = $1', [assignmentId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No submissions found for this assignment.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).send('Server error');
    }
});

// Fetch rubrics for a specific instructor
router.get('/instructors/:instructorId/rubrics', async (req, res) => {
    const { instructorId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM "AssignmentRubric" WHERE "instructorId" = $1',
            [instructorId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching rubrics:', error);
        res.status(500).json({ message: 'Error fetching rubrics' });
    }
});

// Fetch rubrics by courseId
router.get('/rubrics', async (req, res) => {
    const courseId = req.session.courseId;
    if (!courseId) {
        return res.status(400).json({ message: 'Course ID not set in session' });
    }
    
    try {
        const result = await pool.query(
            'SELECT * FROM "AssignmentRubric" WHERE "courseId" = $1',
            [courseId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching rubrics:', error);
        res.status(500).json({ message: 'Error fetching rubrics' });
    }
});

// Fetch rubrics by rubricId
router.get('/rubric/:rubricId', async (req, res) => {
    const { rubricId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM "AssignmentRubric" WHERE "assignmentRubricId" = $1',
            [rubricId]
        );
        console.log('Fetched Rubric:', result.rows); // Debug log
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching rubric:', error);
        res.status(500).json({ message: 'Error fetching rubric' });
    }
});

// Get published assignments by course ID
router.get('/assignments/course/:courseId', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
    }

    try {
        const result = await pool.query('SELECT * FROM "Assignment" WHERE "courseId" = $1 AND "isPublished" = true', [courseId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No assignments found for this course' });
        }

        const assignments = result.rows.map(assignment => ({
            ...assignment,
            dueDate: formatDueDate(assignment.dueDate)
        }));

        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error.message);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

// Get all assignments by course ID
router.get('/assignments/course/:courseId/all', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
    }

    try {
        const result = await pool.query('SELECT * FROM "Assignment" WHERE "courseId" = $1', [courseId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No assignments found for this course' });
        }

        const assignments = result.rows.map(assignment => ({
            ...assignment,
            dueDate: formatDueDate(assignment.dueDate)
        }));

        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error.message);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

// Count published  assignments by course ID
router.get('/assignments/count/:courseId', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
    }

    try {
        const result = await pool.query('SELECT COUNT(*) FROM "Assignment" WHERE "courseId" = $1 AND "isPublished" = true', [courseId]);
        const totalAssignments = parseInt(result.rows[0].count, 10);
        res.status(200).json({ totalAssignments });
    } catch (error) {
        console.error('Error fetching total assignments:', error.message);
        res.status(500).json({ message: 'Error fetching total assignments' });
    }
});

// Count all assignments by course ID
router.get('/assignments/count/:courseId/all', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
    }

    try {
        const result = await pool.query('SELECT COUNT(*) FROM "Assignment" WHERE "courseId" = $1', [courseId]);
        const totalAssignments = parseInt(result.rows[0].count, 10);
        res.status(200).json({ totalAssignments });
    } catch (error) {
        console.error('Error fetching total assignments:', error.message);
        res.status(500).json({ message: 'Error fetching total assignments' });
    }
});

// Update assignment by ID with error handling for missing rubrics
router.put('/assignments/:assignmentId', async (req, res) => {
    const { assignmentId } = req.params;
    const { assignmentName, dueDate, assignmentDescription, criteria } = req.body;

    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            'UPDATE "Assignment" SET "assignmentName" = $1, "dueDate" = $2, "assignmentDescription" = $3 WHERE "assignmentId" = $4 RETURNING *',
            [assignmentName, dueDate, assignmentDescription, assignmentId]
        );

        if (result.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const rubricResult = await pool.query(
            `SELECT ar."assignmentRubricId" 
             FROM "AssignmentRubric" ar 
             JOIN "useRubric" ur ON ar."assignmentRubricId" = ur."assignmentRubricId" 
             WHERE ur."assignmentId" = $1`,
            [assignmentId]
        );

        let assignmentRubricId;

        if (rubricResult.rows.length === 0) {
            const newRubricResult = await pool.query(
                'INSERT INTO "AssignmentRubric" ("rubricName", "criteria", "courseId") VALUES ($1, $2, $3) RETURNING "assignmentRubricId"',
                [assignmentName, criteria, result.rows[0].courseId]
            );
            assignmentRubricId = newRubricResult.rows[0].assignmentRubricId;
            await pool.query(
                'INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId") VALUES ($1, $2)',
                [assignmentId, assignmentRubricId]
            );
        } else {
            assignmentRubricId = rubricResult.rows[0].assignmentRubricId;
            await pool.query(
                'UPDATE "AssignmentRubric" SET "criteria" = $1 WHERE "assignmentRubricId" = $2',
                [criteria, assignmentRubricId]
            );
        }
        await pool.query('COMMIT');

        res.status(200).json(result.rows[0]);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Error updating assignment' });
    }
});

// publish or unpublish assignment
router.put('/assignments/:assignmentId/toggle-publish', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            'SELECT "isPublished" FROM "Assignment" WHERE "assignmentId" = $1',
            [assignmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const currentStatus = result.rows[0].isPublished;
        const updatedResult = await pool.query(
            'UPDATE "Assignment" SET "isPublished" = $1 WHERE "assignmentId" = $2 RETURNING *',
            [!currentStatus, assignmentId]
        );

        res.status(200).json({ message: 'Assignment publish status updated successfully', assignment: updatedResult.rows[0] });
    } catch (error) {
        console.error('Error toggling publish status:', error);
        res.status(500).json({ message: 'Error toggling publish status' });
    }
});

// Check if an assignment is published
router.get('/assignments/:assignmentId/isPublished', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            'SELECT "isPublished" FROM "Assignment" WHERE "assignmentId" = $1',
            [assignmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ isPublished: result.rows[0].isPublished });
    } catch (error) {
        console.error('Error checking publish status:', error);
        res.status(500).json({ message: 'Error checking publish status' });
    }
});

// Publish an assignment
router.put('/assignments/:assignmentId/publish', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            'UPDATE "Assignment" SET "isPublished" = true WHERE "assignmentId" = $1 RETURNING *',
            [assignmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment published successfully', assignment: result.rows[0] });
    } catch (error) {
        console.error('Error publishing assignment:', error);
        res.status(500).json({ message: 'Error publishing assignment' });
    }
});

// Unpublish an assignment
router.put('/assignments/:assignmentId/unpublish', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            'UPDATE "Assignment" SET "isPublished" = false WHERE "assignmentId" = $1 RETURNING *',
            [assignmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment unpublished successfully', assignment: result.rows[0] });
    } catch (error) {
        console.error('Error unpublishing assignment:', error);
        res.status(500).json({ message: 'Error unpublishing assignment' });
    }
});

router.put('/rubric/:rubricId', async (req, res) => {
    const { rubricId } = req.params;
    const { rubricName, criteria } = req.body;

    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            'UPDATE "AssignmentRubric" SET "rubricName" = $1, "criteria" = $2 WHERE "assignmentRubricId" = $3 RETURNING *',
            [rubricName, criteria, rubricId]
        );

        if (result.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Rubric not found' });
        }
        await pool.query('COMMIT');

        res.status(200).json(result.rows[0]);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating rubric:', error);
        res.status(500).json({ message: 'Error updating rubric' });
    }
});

// Route to get assignment details
router.get('/assignment/:studentId/:assignmentId', checkAuthenticated, async (req, res) => {
    const { studentId, assignmentId } = req.params;

    try {
        const query = `
            SELECT
                a."assignmentName",
                s."studentId" AS studentNumber,
                a."dueDate",
                a."maxObtainableGrade",
                sf."AIFeedbackText",
                sf."InstructorFeedbackText",
                ag."AIassignedGrade",
                ag."InstructorAssignedFinalGrade"
            FROM
                "Assignment" a
            JOIN
                "AssignmentSubmission" asub ON a."assignmentId" = asub."assignmentId"
            JOIN
                "Student" s ON asub."studentId" = s."studentId"
            LEFT JOIN
                "StudentFeedback" sf ON asub."assignmentId" = sf."assignmentId" AND asub."studentId" = sf."studentId"
            LEFT JOIN
                "AssignmentGrade" ag ON asub."assignmentSubmissionId" = ag."assignmentSubmissionId"
            WHERE
                s."studentId" = $1 AND a."assignmentId" = $2;`;

        const result = await pool.query(query, [studentId, assignmentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching assignment details:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route to mark assignment as complete
router.put('/assignment/complete/:studentId/:assignmentId', checkAuthenticated, async (req, res) => {
    const { studentId, assignmentId } = req.params;
    const { dueDate, InstructorAssignedFinalGrade, AIFeedbackText, InstructorFeedbackText } = req.body;

    try {
        const updateQuery = `
            UPDATE "Assignment"
            SET
                "dueDate" = $1,
                "isGraded" = true
            WHERE
                "assignmentId" = $2`;

        await pool.query(updateQuery, [dueDate, assignmentId]);

        const updateGradeQuery = `
            UPDATE "AssignmentGrade"
            SET
                "InstructorAssignedFinalGrade" = $1,
                "isGraded" = true
            WHERE
                "assignmentId" = $2 AND "assignmentSubmissionId" = (
                    SELECT "assignmentSubmissionId" FROM "AssignmentSubmission" WHERE "assignmentId" = $2 AND "studentId" = $3
                )`;

        await pool.query(updateGradeQuery, [InstructorAssignedFinalGrade, assignmentId, studentId]);

        const updateFeedbackQuery = `
            UPDATE "StudentFeedback"
            SET
                "AIFeedbackText" = $1,
                "InstructorFeedbackText" = $2
            WHERE
                "assignmentId" = $3 AND "studentId" = $4`;

        await pool.query(updateFeedbackQuery, [AIFeedbackText, InstructorFeedbackText, assignmentId, studentId]);

        res.status(200).json({ message: 'Assignment marked as complete' });
    } catch (error) {
        console.error('Error marking assignment as complete:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/ai/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const instructorId = req.session.instructorId;

    try {
        const response = await axios.post(`http://localhost:5173/ai/assignments/${assignmentId}/process-submissions`, {
            instructorId: instructorId
        }, {
            withCredentials: true
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Error forwarding grading request: ${error.message}`);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Failed to process submissions' });
        }
    }
});

const getSelectedPrompt = async (instructorId) => {
    try {
        const result = await pool.query('SELECT promptText FROM "Prompt" WHERE "instructorId" = $1 AND "isSelected" = true', [instructorId]);
        return result.rows.length > 0 ? result.rows[0].promptText : '';
    } catch (error) {
        console.error('Error fetching selected prompt:', error);
        return '';
    }
};

const getAssignmentRubric = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT criteria FROM "AssignmentRubric" ar JOIN "useRubric" ur ON ar."assignmentRubricId" = ur."assignmentRubricId" WHERE ur."assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].criteria : '';
    } catch (error) {
        console.error('Error fetching assignment rubric:', error);
        return '';
    }
};

const getMaxPoints = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT maxObtainableGrade FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].maxObtainableGrade : 100;
    } catch (error) {
        console.error('Error fetching max points:', error);
        return 100;
    }
};

const getAssignmentKey = async (assignmentId) => {
    try {
        const result = await pool.query('SELECT assignmentKey FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
        return result.rows.length > 0 ? result.rows[0].assignmentKey : '';
    } catch (error) {
        console.error('Error fetching assignment key:', error);
        return '';
    }
};

const processStudentSubmissions = async (studentId, submissions, assistantId, instructorPrompt, assignmentRubric, maxPoints, assignmentKeyPath) => {
    const submissionFileStreams = submissions.map(file => fs.createReadStream(path.resolve(baseDirSubmissions, studentId, file.submissionFile)));
    let submissionVectorStore = await openai.beta.vectorStores.create({
        name: `Student ${studentId} Submissions`,
    });
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(submissionVectorStore.id, submissionFileStreams);
    let assignmentKeyVectorStore = await openai.beta.vectorStores.create({
        name: `Assignment ${studentId} Key`,
    });
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(assignmentKeyVectorStore.id, [fs.createReadStream(assignmentKeyPath)]);
    await openai.beta.assistants.update(assistantId, {
        tool_resources: {
            file_search: {
                vector_store_ids: [submissionVectorStore.id, assignmentKeyVectorStore.id]
            }
        },
    });

    const threadResponse = await axios.post('http://backend-ai:9000/gpt/completions', {}, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    const thread = threadResponse.data;

    const messageContent = `Grade the student assignment using the following rubric: ${assignmentRubric} and the assignment key provided. The maximum points available for this assignment is ${maxPoints}. Additional Instructions: ${instructorPrompt}`;

    const messageResponse = await axios.post(`http://backend-ai:9000/gpt/completions/${thread.id}/messages`, {
        role: "user",
        content: messageContent
    }, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    if (!messageResponse.data || messageResponse.status !== 200) {
        throw new Error('Failed to post message to the thread');
    }

    const runResponse = await axios.post(`http://backend-ai:9000/gpt/completions/${thread.id}/runs`, {
        assistant_id: assistantId,
    }, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    let response = await axios.get(`http://backend-ai:9000/gpt/completions/${thread.id}/runs/${runResponse.data.id}`, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    while (response.data.status === "in_progress" || response.data.status === "queued") {
        console.log("Waiting for assistant's response...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        response = await axios.get(`http://backend-ai:9000/gpt/completions/${thread.id}/runs/${runResponse.data.id}`, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });
    }

    const threadMessagesResponse = await axios.get(`http://backend-ai:9000/gpt/completions/${thread.id}/messages`, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });

    const messages = threadMessagesResponse.data.data;
    const latestAssistantMessage = messages.filter(message => message.role === 'assistant').pop();
    return latestAssistantMessage ? JSON.parse(latestAssistantMessage.content) : null;
};

const processSubmissions = async (assignmentId, instructorId, courseId) => {
    try {
        const submissions = await pool.query(
            'SELECT * FROM "AssignmentSubmission" WHERE "assignmentId" = $1 AND "isSubmitted" = true',
            [assignmentId]
        );

        if (submissions.rows.length === 0) {
            return { status: 404, message: 'No submissions found for this assignment.' };
        }

        const selectedPrompt = await getSelectedPrompt(instructorId);
        const assignmentRubric = await getAssignmentRubric(assignmentId);
        const maxPoints = await getMaxPoints(assignmentId);

        const assignmentKeyResult = await getAssignmentKey(assignmentId);

        if (!assignmentKeyResult) {
            return { status: 404, message: 'Assignment key not found.' };
        }

        const assignmentKeyPath = path.resolve(baseDirKeys, instructorId, courseId, assignmentId, assignmentKeyResult);

        const assistantResponse = await openai.beta.assistants.create({
            name: "AIValuate Grading Assistant",
            instructions: 'You are a web development expert. Your task is to grade student assignments based on the provided rubric and additional instructions. Provide constructive feedback for each submission, and a grade based on the maximum points available.',
            model: "gpt-4o",
            tools: [{ type: "code_interpreter" }, { type: "file_search" }]
        });

        const assistant = assistantResponse.data;
        const assistantId = assistant.id;
        const studentSubmissions = submissions.rows.reduce((acc, submission) => {
            if (!acc[submission.studentId]) {
                acc[submission.studentId] = [];
            }
            acc[submission.studentId].push(submission);
            return acc;
        }, {});

        for (const studentId in studentSubmissions) {
            const aiResponse = await processStudentSubmissions(studentId, studentSubmissions[studentId], assistantId, selectedPrompt, assignmentRubric, maxPoints, assignmentKeyPath);

            if (aiResponse) {
                const grade = aiResponse.grade;
                const feedback = aiResponse.feedback;

                await pool.query(
                    'INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "AIassignedGrade") VALUES ($1, $2, $3) ON CONFLICT ("assignmentSubmissionId", "assignmentId") DO UPDATE SET "AIassignedGrade" = EXCLUDED."AIassignedGrade"',
                    [studentSubmissions[studentId][0].assignmentSubmissionId, assignmentId, grade]
                );

                await pool.query(
                    'INSERT INTO "StudentFeedback" ("studentId", "assignmentId", "courseId", "AIFeedbackText") VALUES ($1, $2, $3, $4) ON CONFLICT ("studentId", "assignmentId") DO UPDATE SET "AIFeedbackText" = EXCLUDED."AIFeedbackText"',
                    [studentId, assignmentId, studentSubmissions[studentId][0].courseId, feedback]
                );
            }
        }

        return { status: 200, message: 'Submissions processed successfully' };
    } catch (error) {
        console.error('Error processing submissions:', error);
        return { status: 500, message: 'Server error' };
    }
};

router.post('/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const instructorId = req.session.instructorId;
    const courseId = req.session.courseId;
    const result = await processSubmissions(assignmentId, instructorId, courseId);
    res.status(result.status).json({ message: result.message });
});

router.post('/ai/assignments/:assignmentId/process-submissions', async (req, res) => {
    const { assignmentId } = req.params;
    const instructorId = req.session.instructorId;
    const courseId = req.session.courseId;

    try {
        const response = await axios.post(`http://localhost:5173/ai/assignments/${assignmentId}/process-submissions`, {
            instructorId,
            courseId
        }, {
            withCredentials: true
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Error forwarding grading request: ${error.message}`);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Failed to process submissions' });
        }
    }
});

module.exports = router;