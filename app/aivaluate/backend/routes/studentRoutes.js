const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); // Adjust the path according to your project structure
const bcrypt = require('bcrypt');


// Route to get current student's ID from session
router.get('/student/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.status(200).json({ studentId: req.user.studentId });
});

// Route to get student firstName by studentId
router.get('/student/:studentId/firstName', async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    try {
        const result = await pool.query('SELECT "firstName" FROM "Student" WHERE "studentId" = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ firstName: result.rows[0].firstName });
    } catch (error) {
        console.error('Error fetching student firstName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to set student firstName by studentId
router.put('/student/:studentId/firstName', async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const { firstName } = req.body;

    try {
        await pool.query('UPDATE "Student" SET "firstName" = $1 WHERE "studentId" = $2', [firstName, studentId]);
        res.status(200).json({ message: 'First name updated successfully' });
    } catch (error) {
        console.error('Error updating student firstName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Similar routes for lastName, email, and password
// Route to get student lastName by studentId
router.get('/student/:studentId/lastName', async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    try {
        const result = await pool.query('SELECT "lastName" FROM "Student" WHERE "studentId" = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ lastName: result.rows[0].lastName });
    } catch (error) {
        console.error('Error fetching student lastName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to set student lastName by studentId
router.put('/student/:studentId/lastName', async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const { lastName } = req.body;

    try {
        await pool.query('UPDATE "Student" SET "lastName" = $1 WHERE "studentId" = $2', [lastName, studentId]);
        res.status(200).json({ message: 'Last name updated successfully' });
    } catch (error) {
        console.error('Error updating student lastName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get student email by studentId
router.get('/student/:studentId/email', async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    try {
        const result = await pool.query('SELECT "email" FROM "Student" WHERE "studentId" = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ email: result.rows[0].email });
    } catch (error) {
        console.error('Error fetching student email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to set student email by studentId
router.put('/student/:studentId/email', async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const { email } = req.body;

    try {
        await pool.query('UPDATE "Student" SET "email" = $1 WHERE "studentId" = $2', [email, studentId]);
        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        console.error('Error updating student email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get student password by studentId
router.get('/student/:studentId/password', async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    try {
        const result = await pool.query('SELECT "password" FROM "Student" WHERE "studentId" = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ password: result.rows[0].password });
    } catch (error) {
        console.error('Error fetching student password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to set student password by studentId
router.put('/student/:studentId/password', async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query('UPDATE "Student" SET "password" = $1 WHERE "studentId" = $2', [hashedPassword, studentId]);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating student password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
