const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/stu-api/login');
}

// Endpoint to fetch student details
router.get('/student/:studentId', checkAuthenticated, async (req, res) => {
    const { studentId } = req.params;

    try {
        // Query to get student details
        const studentDetailsQuery = `
            SELECT s."firstName", s."lastName", s."studentId", s."email", s."password",
                   array_agg(c."courseCode") FILTER (WHERE c."courseCode" IS NOT NULL) AS "courses"
            FROM "Student" s
            LEFT JOIN "EnrolledIn" e ON s."studentId" = e."studentId"
            LEFT JOIN "Course" c ON e."courseId" = c."courseId"
            WHERE s."studentId" = $1
            GROUP BY s."firstName", s."lastName", s."studentId", s."email", s."password"
        `;
        const studentDetailsResult = await pool.query(studentDetailsQuery, [studentId]);
        const studentDetails = studentDetailsResult.rows[0];

        // Send the student details as response
        res.json(studentDetails);
    } catch (err) {
        console.error('Error fetching student details:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to drop a course
router.post('/drop-course', checkAuthenticated, async (req, res) => {
    const { studentId, courseId } = req.body;

    try {
        // Query to delete course enrollment
        const dropCourseQuery = `
            DELETE FROM "EnrolledIn"
            WHERE "studentId" = $1 AND "courseId" = $2
        `;
        await pool.query(dropCourseQuery, [studentId, courseId]);

        // Send success response
        res.status(200).json({ message: 'Course dropped successfully' });
    } catch (err) {
        console.error('Error dropping course:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
