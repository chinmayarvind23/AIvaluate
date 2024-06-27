const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

// Delete a student
router.delete('/students/:id', (req, res) => {
    const studentId = req.params.id;
    pool.query('DELETE FROM "Student" WHERE "studentId" = $1', [studentId], (err, results) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(204).send();
    });
});

// Get student details
router.get('/students/:id', (req, res) => {
    const studentId = req.params.id;
    pool.query('SELECT * FROM "Student" WHERE "studentId" = $1', [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching student:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.rows.length > 0) {
            res.json(results.rows[0]);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    });
});

// Update student courses
router.put('/students/:id/courses', async (req, res) => {
    const studentId = req.params.id;
    const { courses } = req.body;

    try {
        pool.query(
            'UPDATE "Student" SET courses = $1 WHERE "studentId" = $2 RETURNING *',
            [JSON.stringify(courses), studentId],
            (err, results) => {
                if (err) {
                    console.error('Error updating student courses:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json(results.rows[0]);
            }
        );
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
