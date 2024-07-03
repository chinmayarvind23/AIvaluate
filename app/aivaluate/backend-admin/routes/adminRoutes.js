const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../dbConfig');
require('dotenv').config();

// Define your admin-specific routes here

// Example: Admin Dashboard
router.get('/admin-api/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});

// Route to get current evaluator's ID from session
router.get('/admin/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.status(200).json({ adminId: req.user.adminId });
});

// Route to get evaluator firstName by adminId
router.get('/admin/:adminId/firstName', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "firstName" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ firstName: result.rows[0].firstName });
    } catch (error) {
        console.error('Error fetching admin firstName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get admin lastName by adminId
router.get('/admin/:adminId/lastName', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "lastName" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.status(200).json({ lastName: result.rows[0].lastName });
    } catch (error) {
        console.error('Error fetching admin lastName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get admin email by adminId
router.get('/admin/:adminId/email', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "email" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.status(200).json({ email: result.rows[0].email });
    } catch (error) {
        console.error('Error fetching admin email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to get admin password by adminId
router.get('/admin/:adminId/password', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "password" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.status(200).json({ password: result.rows[0].password });
    } catch (error) {
        console.error('Error fetching admin password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to verify admin password by adminId
router.post('/admin/:adminId/verifyPassword', async (req, res) => {
    const adminId = parseInt(req.params.adminId);
    const { currentPassword } = req.body;

    try {
        const result = await pool.query('SELECT "password" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
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

// Route to set admin password by adminId
router.put('/admin/:adminId/password', async (req, res) => {
    const adminId = parseInt(req.params.adminId);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query('UPDATE "SystemAdministrator" SET "password" = $1 WHERE "adminId" = $2', [hashedPassword, adminId]);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating admin password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
