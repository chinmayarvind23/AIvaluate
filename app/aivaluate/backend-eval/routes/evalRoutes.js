const express = require('express');
const router = express.Router();
const passport = require('passport');

// Instructor login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/eval-api/dashboard',
    failureRedirect: '/eval-api/login',
    failureFlash: true
}));

// Instructor dashboard route
router.get('/dashboard', (req, res) => {
    res.send('Evaluator Dashboard');
});

// Instructor login page route
router.get('/login', (req, res) => {
    res.send('Evaluator Login Page');
});

module.exports = router;
