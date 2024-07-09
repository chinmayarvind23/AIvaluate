const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');

// Create a new assignment
router.post('/assignments', async (req, res) => {
    const { courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription") VALUES ($1, $2, $3, $4, $5) RETURNING "assignmentId"',
            [courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription]
        );
        res.status(201).json({ assignmentId: result.rows[0].assignmentId, message: 'Assignment created successfully' });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Error creating assignment' });
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

// Fetch a single rubric by ID
router.get('/rubrics/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "AssignmentRubric" WHERE "assignmentRubricId" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rubric not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching rubric:', error);
        res.status(500).json({ message: 'Error fetching rubric' });
    }
});
// Fetch all rubrics
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
    const { assignmentId, courseId, title, criteria } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO "AssignmentRubric" ("assignmentId", "courseId", "title", "criteria") VALUES ($1, $2, $3, $4) RETURNING *',
            [assignmentId, courseId, title, criteria]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding rubric:', error);
        res.status(500).json({ message: 'Error adding rubric' });
    }
});
// Update a rubric
router.put('/rubrics/:id', async (req, res) => {
    const { id } = req.params;
    const { title, criteria } = req.body;

    try {
        const result = await pool.query(
            'UPDATE "AssignmentRubric" SET "title" = $1, "criteria" = $2 WHERE "assignmentRubricId" = $3 RETURNING *',
            [title, criteria, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rubric not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating rubric:', error);
        res.status(500).json({ message: 'Error updating rubric' });
    }
});


// Add a solution
router.post('/assignments/:assignmentId/solutions', async (req, res) => {
    const { assignmentId } = req.params;
    const { solutionFile } = req.body;

    try {
        await pool.query(
            'UPDATE "Assignment" SET "solutionFile" = $1 WHERE "assignmentId" = $2',
            [solutionFile, assignmentId]
        );
        res.status(200).json({ message: 'Solution added successfully' });
    } catch (error) {
        console.error('Error adding solution:', error);
        res.status(500).json({ message: 'Error adding solution' });
    }
});

// Get solution by assignment ID
router.get('/assignments/:assignmentId/solutions', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query('SELECT "solutionFile" FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
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
    const { solutionFile } = req.body;

    try {
        const result = await pool.query(
            'UPDATE "Assignment" SET "solutionFile" = $1 WHERE "assignmentId" = $2 RETURNING *',
            [solutionFile, assignmentId]
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
            'UPDATE "Assignment" SET "solutionFile" = NULL WHERE "assignmentId" = $1 RETURNING *',
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
router.get('/rubrics/:courseId', async (req, res) => {
    const { courseId } = req.params;
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

module.exports = router;