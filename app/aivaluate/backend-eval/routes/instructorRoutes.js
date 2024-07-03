const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

// Route to get current evaluator's ID from session
router.get('/instructor/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.status(200).json({ instructorId: req.user.instructorId });
});

// Route to get evaluator firstName by instructorId
router.get('/instructor/:instructorId/firstName', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId);

    try {
        const result = await pool.query('SELECT "firstName" FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json({ firstName: result.rows[0].firstName });
    } catch (error) {
        console.error('Error fetching instructor firstName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get instructor lastName by instructorId
router.get('/instructor/:instructorId/lastName', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId);

    try {
        const result = await pool.query('SELECT "lastName" FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json({ lastName: result.rows[0].lastName });
    } catch (error) {
        console.error('Error fetching instructor lastName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get instructor email by instructorId
router.get('/instructor/:instructorId/email', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId);

    try {
        const result = await pool.query('SELECT "email" FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json({ email: result.rows[0].email });
    } catch (error) {
        console.error('Error fetching instructor email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to get instructor password by instructorId
router.get('/instructor/:instructorId/password', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId);

    try {
        const result = await pool.query('SELECT "password" FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json({ password: result.rows[0].password });
    } catch (error) {
        console.error('Error fetching instructor password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to verify instructor password by instructorId
router.post('/instructor/:instructorId/verifyPassword', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId);
    const { currentPassword } = req.body;

    try {
        const result = await pool.query('SELECT "password" FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
        if (isMatch) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to set instructor password by instructorId
router.put('/instructor/:instructorId/password', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query('UPDATE "Instructor" SET "password" = $1 WHERE "instructorId" = $2', [hashedPassword, instructorId]);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating instructor password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all instructors
router.get('/instructors', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Instructor" WHERE "isTA" = FALSE');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

// Get all TAs
router.get('/tas', async (req, res) => {   
    try {
        const tas = await pool.query('SELECT * FROM "Instructor" WHERE "isTA" = TRUE');
        res.status(200).send(tas.rows);
    } catch (error) {
        console.error('Error fetching TAs:', error);
        res.status(500).send({ message: 'Error fetching TAs' });
    }
});

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

module.exports = router;