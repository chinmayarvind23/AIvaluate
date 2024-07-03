const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

// Middleware to check if authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin-api/login');
}

// Route to get all evaluators
router.get('/evaluators', checkAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT "firstName", "lastName", "isTA"
            FROM "Instructor"
        `;
        const result = await pool.query(query);
        const evaluators = result.rows.map(row => ({
            name: `${row.firstName} ${row.lastName}`,
            TA: row.isTA
        }));
        res.json(evaluators);
    } catch (err) {
        console.error('Error fetching evaluators:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Export the router
module.exports = router;
