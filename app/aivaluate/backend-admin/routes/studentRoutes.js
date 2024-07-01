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

// Fetch all students
router.get('/students', (req, res) => {
    pool.query('SELECT * FROM "Student"', (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results.rows);
    });
});


//Selects all information about a student and their enrolled courses
router.get('/student/:studentId', checkAuthenticated, async (req, res) => {
    const { studentId } = req.params;

    try {
        const studentQuery = `
            SELECT s."studentId", s."firstName", s."lastName", s."email", s."password"
            FROM "Student" s
            WHERE s."studentId" = $1
        `;
        const studentResult = await pool.query(studentQuery, [studentId]);
        const student = studentResult.rows[0];

        const courseQuery = `
            SELECT c."courseCode", c."courseId"
            FROM "Course" c
            JOIN "EnrolledIn" e ON c."courseId" = e."courseId"
            WHERE e."studentId" = $1
        `;
        const courseResult = await pool.query(courseQuery, [studentId]);
        const courses = courseResult.rows;

        res.json({
            ...student,
            courses
        });
    } catch (err) {
        console.error('Error fetching student details:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

//Drops a student from a course
router.delete('/student/:studentId/drop/:courseCode', checkAuthenticated, async (req, res) => {
    const { studentId, courseCode } = req.params;

    try {
        const dropQuery = `
            DELETE FROM "EnrolledIn"
            WHERE "studentId" = $1 AND "courseId" = (
                SELECT "courseId" FROM "Course" WHERE "courseCode" = $2
            )
        `;
        await pool.query(dropQuery, [studentId, courseCode]);
        res.status(200).json({ message: 'Course dropped successfully' });
    } catch (err) {
        console.error('Error dropping course:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Deletes a student from the database
router.delete('/student/:studentId', checkAuthenticated, async (req, res) => {
    const { studentId } = req.params;

    try {
        const deleteQuery = `
            DELETE FROM "Student"
            WHERE "studentId" = $1
        `;
        await pool.query(deleteQuery, [studentId]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to fetch all students
router.get('/students', checkAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT "studentId", "firstName", "lastName"
            FROM "Student"
        `;
        const result = await pool.query(query);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Database error' });
    }
});





module.exports = router;
