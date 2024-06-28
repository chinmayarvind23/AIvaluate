const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

router.post('/teaches', async (req, res) => {
    const { courseId, instructorId } = req.body;
    try {
        await pool.query('INSERT INTO "Teaches" ("courseId", "instructorId") VALUES ($1, $2)', [courseId, instructorId]);
        res.status(201).send({ message: 'Instructor/TA added to course successfully' });
    } catch (error) {
        console.error('Error adding Instructor/TA to course:', error);
        res.status(500).send({ message: 'Error adding Instructor/TA to course' });
    }
});

// Create a course
router.post('/courses', async (req, res) => {
    const { courseName, courseCode, maxStudents } = req.body;

    console.log(req.body);

    try {
        const result = await pool.query(
            'INSERT INTO "Course" ("courseName", "courseCode", "maxStudents") VALUES ($1, $2, $3) RETURNING "courseId"',
            [courseName, courseCode, maxStudents]
        );
        res.status(201).send({ courseId: result.rows[0].courseId, message: 'Course created successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send({ message: 'Error creating course' });
    }
});

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Course"');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

module.exports = router;