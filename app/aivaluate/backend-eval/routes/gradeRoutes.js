const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/eval-api/login');
}

router.get('/evaluator-grades/:courseId', checkAuthenticated, async (req, res) => {
    const { courseId } = req.params;

    try {
        // Query to get assignment details ordered by due date
        const assignmentDetailsQuery = `
            SELECT a."assignmentName" AS "name", 
                   a."dueDate" AS "due",
                   COALESCE(SUM(ag."InstructorAssignedFinalGrade"), 0) AS "avgGrade",
                   COALESCE(SUM(a."maxObtainableGrade"), 0) AS "totalGrade"
            FROM "Assignment" a
            LEFT JOIN "AssignmentSubmission" asub ON a."assignmentId" = asub."assignmentId"
            LEFT JOIN "AssignmentGrade" ag ON asub."assignmentSubmissionId" = ag."assignmentSubmissionId"
            WHERE a."courseId" = $1  
            AND ag."AIassignedGrade" IS NOT NULL
            GROUP BY a."assignmentName", a."dueDate"
            ORDER BY a."dueDate" ASC
        `;
        const assignmentDetailsResult = await pool.query(assignmentDetailsQuery, [courseId]);
        const assignmentDetails = assignmentDetailsResult.rows;

        // Send the result as response
        res.json(assignmentDetails);
    } catch (err) {
        console.error('Error fetching evaluator grades:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;