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
    const { courseId, dueDate, assignmentName, maxObtainableGrade, rubricName, criteria, assignmentKey } = req.body;

    try {
        // Begin transaction
        await pool.query('BEGIN');
 
        // Insert the new assignment
        const assignmentResult = await pool.query(
            'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentName", "maxObtainableGrade", "assignmentKey") VALUES ($1, $2, $3, $4, $5) RETURNING "assignmentId"',
            [courseId, dueDate, assignmentName, maxObtainableGrade, assignmentKey]
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

// // Add a solution
// router.post('/assignments/:assignmentId/solutions', async (req, res) => {
//     const { assignmentId } = req.params;
//     const { solutionFile } = req.body;

//     try {
//         await pool.query(
//             'UPDATE "Assignment" SET "solutionFile" = $1 WHERE "assignmentId" = $2',
//             [solutionFile, assignmentId]
//         );
//         res.status(200).json({ message: 'Solution added successfully' });
//     } catch (error) {
//         console.error('Error adding solution:', error);
//         res.status(500).json({ message: 'Error adding solution' });
//     }
// });

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

// Fetch assignment by ID with error handling for missing rubrics
router.get('/assignments/:assignmentId', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const result = await pool.query(
            `SELECT a."assignmentName", a."dueDate", ar."criteria" 
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

        // If the assignment has no rubric, create a blank rubric
        if (!assignment.criteria) {
            const rubricResult = await pool.query(
                'INSERT INTO "AssignmentRubric" ("rubricName", "criteria", "courseId") VALUES ($1, $2, $3) RETURNING "assignmentRubricId"',
                [assignment.assignmentName, '', assignment.courseId]
            );

            const assignmentRubricId = rubricResult.rows[0].assignmentRubricId;

            // Link the new rubric to the assignment
            await pool.query(
                'INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId") VALUES ($1, $2)',
                [assignmentId, assignmentRubricId]
            );

            // Fetch the updated assignment with the new rubric
            const updatedResult = await pool.query(
                `SELECT a."assignmentName", a."dueDate", ar."criteria" 
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

// Update assignment by ID with error handling for missing rubrics
router.put('/assignments/:assignmentId', async (req, res) => {
    const { assignmentId } = req.params;
    const { assignmentName, dueDate, criteria } = req.body;

    try {
        // Begin transaction
        await pool.query('BEGIN');

        // Update the assignment
        const result = await pool.query(
            'UPDATE "Assignment" SET "assignmentName" = $1, "dueDate" = $2 WHERE "assignmentId" = $3 RETURNING *',
            [assignmentName, dueDate, assignmentId]
        );

        if (result.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if the assignment has an associated rubric
        const rubricResult = await pool.query(
            `SELECT ar."assignmentRubricId" 
             FROM "AssignmentRubric" ar 
             JOIN "useRubric" ur ON ar."assignmentRubricId" = ur."assignmentRubricId" 
             WHERE ur."assignmentId" = $1`,
            [assignmentId]
        );

        let assignmentRubricId;

        if (rubricResult.rows.length === 0) {
            // If no rubric is associated, create a blank rubric
            const newRubricResult = await pool.query(
                'INSERT INTO "AssignmentRubric" ("rubricName", "criteria", "courseId") VALUES ($1, $2, $3) RETURNING "assignmentRubricId"',
                [assignmentName, criteria, result.rows[0].courseId]
            );
            assignmentRubricId = newRubricResult.rows[0].assignmentRubricId;

            // Link the new rubric to the assignment
            await pool.query(
                'INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId") VALUES ($1, $2)',
                [assignmentId, assignmentRubricId]
            );
        } else {
            // Update the existing rubric
            assignmentRubricId = rubricResult.rows[0].assignmentRubricId;
            await pool.query(
                'UPDATE "AssignmentRubric" SET "criteria" = $1 WHERE "assignmentRubricId" = $2',
                [criteria, assignmentRubricId]
            );
        }

        // Commit transaction
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
        // Fetch the current isPublished status
        const result = await pool.query(
            'SELECT "isPublished" FROM "Assignment" WHERE "assignmentId" = $1',
            [assignmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const currentStatus = result.rows[0].isPublished;

        // Toggle the isPublished status
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




module.exports = router;