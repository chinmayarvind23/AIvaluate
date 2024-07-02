const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/stu-api/login');
}

router.get('/student-grades/:courseId', checkAuthenticated, async (req, res) => {
    const studentId = req.user.studentId;
    const { courseId } = req.params;

    try {
        // Query to get student name and grade sums
        const studentInfoQuery = `
            SELECT s."firstName", 
                   COALESCE(SUM(ag."InstructorAssignedFinalGrade"), 0) AS "totalGrade",
                   COALESCE(SUM(a."maxObtainableGrade"), 0) AS "totalMaxGrade"
            FROM "Student" s
            LEFT JOIN "AssignmentSubmission" asub ON s."studentId" = asub."studentId"
            LEFT JOIN "AssignmentGrade" ag ON asub."assignmentSubmissionId" = ag."assignmentSubmissionId"
            LEFT JOIN "Assignment" a ON asub."assignmentId" = a."assignmentId"
            WHERE s."studentId" = $1 AND asub."courseId" = $2 AND ag."isGraded" = true
            GROUP BY s."firstName"
        `;
        const studentInfoResult = await pool.query(studentInfoQuery, [studentId, courseId]);
        const studentInfo = studentInfoResult.rows[0];

        // Query to get assignment details
        const assignmentDetailsQuery = `
            SELECT a."assignmentDescription" AS "name", 
                   a."dueDate" AS "due",
                   asub."isSubmitted" AS "submitted", 
                   COALESCE(ag."InstructorAssignedFinalGrade", 0) AS "score",
                   a."maxObtainableGrade" AS "total",
                   ag."isGraded" AS "marked"
            FROM "Assignment" a
            LEFT JOIN "AssignmentSubmission" asub ON a."assignmentId" = asub."assignmentId"
            LEFT JOIN "AssignmentGrade" ag ON asub."assignmentSubmissionId" = ag."assignmentSubmissionId"
            WHERE asub."studentId" = $1 AND a."courseId" = $2
        `;
        const assignmentDetailsResult = await pool.query(assignmentDetailsQuery, [studentId, courseId]);
        const assignmentDetails = assignmentDetailsResult.rows;

        // Send the combined result as response
        res.json({
            studentName: studentInfo.firstName,
            totalGrade: studentInfo.totalGrade,
            totalMaxGrade: studentInfo.totalMaxGrade,
            assignments: assignmentDetails
        });
    } catch (err) {
        console.error('Error fetching student grades:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;