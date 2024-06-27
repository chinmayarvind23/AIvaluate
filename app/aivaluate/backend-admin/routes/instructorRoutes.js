const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 


router.get('/tas', async (req, res) => {   
    try {
        const tas = await pool.query('SELECT * FROM "Instructor" WHERE "isTA" = TRUE');
        res.status(200).send(tas.rows);
    } catch (error) {
        console.error('Error fetching TAs:', error);
        res.status(500).send({ message: 'Error fetching TAs' });
    }
});

router.delete('/teaches/:courseId/:instructorId', async (req, res) => {
    const { courseId, instructorId } = req.params;
    try {
        await pool.query('DELETE FROM "Teaches" WHERE "courseId" = $1 AND "instructorId" = $2', [courseId, instructorId]);
        res.status(200).send({ message: 'Instructor/TA removed from course successfully' });
    } catch (error) {
        console.error('Error removing Instructor/TA from course:', error);
        res.status(500).send({ message: 'Error removing Instructor/TA from course' });
    }
});

module.exports = router;