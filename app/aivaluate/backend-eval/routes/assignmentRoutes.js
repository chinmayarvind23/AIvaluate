const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const { formatDueDate } = require('../util');

// // Create a new assignment
// router.post('/assignments', async (req, res) => {
//     const { courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription } = req.body;

//     try {
//         const result = await pool.query(
//             'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription") VALUES ($1, $2, $3, $4, $5) RETURNING "assignmentId"',
//             [courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription]
//         );
//         res.status(201).json({ assignmentId: result.rows[0].assignmentId, message: 'Assignment created successfully' });
//     } catch (error) {
//         console.error('Error creating assignment:', error);
//         res.status(500).json({ message: 'Error creating assignment' });
//     }
// });

router.post('/assignments', async (req, res) => {
    const { courseId, dueDate, assignmentName, maxObtainableGrade, rubricName, criteria } = req.body;

    try {
        // Begin transaction
        await pool.query('BEGIN');
 
        // Insert the new assignment
        const assignmentResult = await pool.query(
            'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentName", "maxObtainableGrade") VALUES ($1, $2, $3, $4) RETURNING "assignmentId"',
            [courseId, dueDate, assignmentName, maxObtainableGrade]
        );

        const assignmentId = assignmentResult.rows[0].assignmentId;

        // Insert the corresponding rubric
        const rubricResult = await pool.query(
            'INSERT INTO "AssignmentRubric" ("rubricName", "criteria", "courseId") VALUES ($1, $2, $3) RETURNING "assignmentRubricId"',
            [assignmentName, criteria, courseId]
        );

        const assignmentRubricId = rubricResult.rows[0].assignmentRubricId;

        // Insert into useRubric table
        await pool.query(
            'INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId") VALUES ($1, $2)',
            [assignmentId, assignmentRubricId]
        );

        // Commit transaction
        await pool.query('COMMIT');

        res.status(201).json({ assignmentId, assignmentRubricId, message: 'Assignment and rubric created successfully' });
    } catch (error) {
        // Rollback transaction in case of error
        await pool.query('ROLLBACK');
        console.error('Error creating assignment and rubric:', error);
        res.status(500).json({ message: 'Error creating assignment and rubric' });
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

// Get assignments by course ID
router.get('/assignments/course/:courseId', async (req, res) => {
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

// Get total assignments by course ID
router.get('/assignments/count/:courseId', async (req, res) => {
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


module.exports = router;