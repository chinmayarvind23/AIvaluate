// Contributor: Jerry Fan
// Last Edited: June 17, 2024
// Purpose: This file contains the routes for the instructor and TA endpoints
// These routes are called in the CreateCourse.jsx

const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

router.get('/instructors', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Instructor" WHERE "isTA" = FALSE');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

router.get('/tas', async (req, res) => {   
    try {
        const tas = await pool.query('SELECT * FROM "Instructor" WHERE "isTA" = TRUE');
        res.status(200).send(tas.rows);
    } catch (error) {
        console.error('Error fetching TAs:', error);
        res.status(500).send({ message: 'Error fetching TAs' });
    }
});

module.exports = router;