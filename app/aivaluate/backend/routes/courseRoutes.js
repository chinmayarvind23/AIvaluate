const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

// Create a course
// router.post('/courses', async (req, res) => {
//     const { courseName, courseCode, maxStudents } = req.body;

//     console.log(req.body);

//     try {
//         const result = await pool.query(
//             'INSERT INTO "Course" ("courseName", "courseCode", "maxStudents") VALUES ($1, $2, $3) RETURNING "courseId"',
//             [courseName, courseCode, maxStudents]
//         );
//         res.status(201).send({ courseId: result.rows[0].courseId, message: 'Course created successfully' });
//     } catch (error) {
//         console.error('Error creating course:', error);
//         res.status(500).send({ message: 'Error creating course' });
//     }
// });

// // Get all courses
// router.get('/courses', async (req, res) => {
//     try {
//         const courses = await pool.query('SELECT * FROM "Course"');
//         res.status(200).send(courses.rows);
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         res.status(500).send({ message: 'Error fetching courses' });
//     }
// });

// Get a single course by ID
// router.get('/courses/:id', async (req, res) => {
//     const courseId = req.params.id;

//     try {
//         const course = await pool.query('SELECT * FROM "Course" WHERE "courseId" = $1', [courseId]);

//         if (course.rowCount > 0) {
//             res.status(200).send(course.rows[0]);
//         } else {
//             res.status(404).send({ message: 'Course not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching course:', error);
//         res.status(500).send({ message: 'Error fetching course' });
//     }
// });

// // Delete a course
// router.delete('/courses/:id', async (req, res) => {
//     const courseId = req.params.id;

//     try {
//         const result = await pool.query('DELETE FROM "Course" WHERE "courseId" = $1', [courseId]);

//         if (result.rowCount > 0) {
//             res.status(200).send({ message: 'Course deleted successfully' });
//         } else {
//             res.status(404).send({ message: 'Course not found' });
//         }
//     } catch (error) {
//         console.error('Error deleting course:', error);
//         res.status(500).send({ message: 'Error deleting course' });
//     }
// });

// // Update a course
// router.put('/courses/:id', async (req, res) => {
//     const courseId = req.params.id;
//     const { courseName, courseCode, maxStudents } = req.body;

//     try {
//         const result = await pool.query(
//             'UPDATE "Course" SET "courseName" = $1, "courseCode" = $2, "maxStudents" = $3 WHERE "courseId" = $4',
//             [courseName, courseCode, maxStudents, courseId]
//         );

//         if (result.rowCount > 0) {
//             res.status(200).send({ message: 'Course updated successfully' });
//         } else {
//             res.status(404).send({ message: 'Course not found' });
//         }
//     } catch (error) {
//         console.error('Error updating course:', error);
//         res.status(500).send({ message: 'Error updating course' });
//     }
// });

// Fetch all TAs for a course
router.get('/courses/:id/tas', async (req, res) => {
    const courseId = req.params.id;

    try {
        const tas = await pool.query(`
            SELECT I."instructorId", I."firstName", I."lastName", I."email"
            FROM "Instructor" I
            JOIN "Teaches" T ON I."instructorId" = T."instructorId"
            WHERE T."courseId" = $1 AND I."isTA" = TRUE
        `, [courseId]);

        if (tas.rowCount > 0) {
            res.status(200).send(tas.rows);
        } else {
            // Sending an empty array with a 200 status code instead of treating it as an error
            res.status(200).send([]);
        }
    } catch (error) {
        console.error('Error fetching TAs:', error);
        res.status(500).send({ message: 'Error fetching TAs' });
    }
});

// Fetch Instructor for a course
router.get('/courses/:id/instructor', async (req, res) => {
    const courseId = req.params.id;

    try {
        // Adjusted SQL query to join Instructor and Teaches tables and filter for Instructor
        const query = `
            SELECT I."instructorId", I."firstName", I."lastName", I."email"
            FROM "Instructor" I
            JOIN "Teaches" T ON I."instructorId" = T."instructorId"
            WHERE T."courseId" = $1 AND I."isTA" = FALSE;
        `;
        const instructor = await pool.query(query, [courseId]);

        if (instructor.rowCount > 0) {
            res.status(200).send(instructor.rows[0]);
        } else {
            res.status(200).send([]);
        }
    } catch (error) {
        console.error('Error fetching Instructor:', error);
        res.status(500).send({ message: 'Error fetching Instructor' });
    }
});

module.exports = router;

