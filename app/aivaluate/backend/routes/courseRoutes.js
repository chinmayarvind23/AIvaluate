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

router.get('/courses', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Course"');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

router.delete('/courses/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const courseId = req.params.id;  // Get the course ID from the request parameters

        try {
            const deleteResults = await pool.query(
                'DELETE FROM "Course" WHERE "courseId" = $1 RETURNING *',  // Make sure to return something to confirm deletion
                [courseId]
            );

            if (deleteResults.rowCount > 0) {
                res.status(200).json({ message: 'Course deleted successfully', deletedCourse: deleteResults.rows[0] });
            } else {
                res.status(404).json({ error: 'Course not found' });
            }
        } catch (err) {
            console.error('Error deleting course:', err);
            res.status(500).json({ error: 'Database error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

module.exports = router;
