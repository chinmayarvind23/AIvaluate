// Last Edited: June 17, 2024
// Contributor: Jerry Fan
// Purpose: Backend Logic for student account information update
// Used by the Account.jsx in frontend

const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Email user with 2FA:', process.env.EMAIL_USER_2FA);
console.log('Email user without 2FA:', process.env.EMAIL_USER_NO_2FA);

router.get('/users/me', (req, res) => {
    if (req.isAuthenticated()) {
        const userId = req.user.studentId;

        pool.query(
            'SELECT "firstName", "lastName", email, "studentId" FROM "Student" WHERE "studentId" = $1',
            [userId],
            (err, results) => {
                if (err) {
                    console.error('Error fetching user details:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                if (results.rows.length > 0) {
                    res.json(results.rows[0]);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            }
        );
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Update user details
router.put('/users/update', async (req, res) => {
    if (req.isAuthenticated()) {
        const userId = req.user.studentId;
        const { firstName, lastName, email, password } = req.body;

        try {
            let hashedPassword;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            pool.query(
                `UPDATE "Student" 
                SET "firstName" = $1, "lastName" = $2, email = $3, "password" = COALESCE($4, "password")
                WHERE "studentId" = $5
                RETURNING "firstName", "lastName", email, "studentId"`,
                [firstName, lastName, email, hashedPassword, userId],
                (err, results) => {
                    if (err) {
                        console.error('Error updating user details:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json(results.rows[0]);
                }
            );
        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

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

// Route to verify student password by studentId
router.post('/student/:studentId/verifyPassword', async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const { currentPassword } = req.body;

    try {
        const result = await pool.query('SELECT "password" FROM "Student" WHERE "studentId" = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
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

router.post('/stu/forgotpassword', async (req, res) => {
    const { email } = req.body;

    const { default: cryptoRandomString } = await import('crypto-random-string');

    try {
        const result = await pool.query('SELECT * FROM "Student" WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No account with that email found' });
        }

        const student = result.rows[0];
        const token = cryptoRandomString({ length: 20, type: 'url-safe' });
        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour

        await pool.query('UPDATE "Student" SET "resetPasswordToken" = $1, "resetPasswordExpires" = $2 WHERE "studentId" = $3', [token, tokenExpiration, student.studentId]);

        // Choose the correct email credentials
        const emailUser = process.env.EMAIL_USER_2FA;
        const emailPass = process.env.EMAIL_PASS_2FA;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const mailOptions = {
            to: student.email,
            from: 'passwordreset@aivaluate.com',
            subject: 'AIvaluate Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
                   http://localhost:5173/resetpassword/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err.message);
                return res.status(500).json({ message: `Error sending email: ${err.message}` });
            }
            res.status(200).json({ message: 'Recovery email sent' });
        });
    } catch (error) {
        console.error('Error during forgot password process:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle the password reset link
router.get('/stu/reset/:token', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Student" WHERE "resetPasswordToken" = $1 AND "resetPasswordExpires" > NOW()', [req.params.token]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle the new password submission
router.post('/stu/reset/:token', async (req, res) => {
    const { password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM "Student" WHERE "resetPasswordToken" = $1 AND "resetPasswordExpires" > NOW()', [req.params.token]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        const student = result.rows[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('UPDATE "Student" SET "password" = $1, "resetPasswordToken" = $2, "resetPasswordExpires" = $3 WHERE "studentId" = $4', [hashedPassword, null, null, student.studentId]);

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;