const express = require('express');
const router = express.Router();

// Define your admin-specific routes here

// Example: Admin Dashboard
router.get('/admin-api/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});

// Add more routes as needed

module.exports = router;
