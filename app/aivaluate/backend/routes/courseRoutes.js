const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

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

// Get a single course by ID
router.get('/courses/:id', async (req, res) => {
    const courseId = req.params.id;

    try {
        const course = await pool.query('SELECT * FROM "Course" WHERE "courseId" = $1', [courseId]);

        if (course.rowCount > 0) {
            res.status(200).send(course.rows[0]);
        } else {
            res.status(404).send({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send({ message: 'Error fetching course' });
    }
});

router.delete('/courses/:id', async (req, res) => {
    const courseId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM "Course" WHERE "courseId" = $1', [courseId]);

        if (result.rowCount > 0) {
            res.status(200).send({ message: 'Course deleted successfully' });
        } else {
            res.status(404).send({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ message: 'Error deleting course' });
    }
});

module.exports = router;
