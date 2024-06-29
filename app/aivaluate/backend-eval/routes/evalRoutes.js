// const express = require('express');
// const router = express.Router();
// const passport = require('passport');

// Instructor login route
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/eval-api/dashboard',
//     failureRedirect: '/eval-api/login',
//     failureFlash: true
// }));

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next(); // User is authenticated, continue to the next middleware
//     }
//     // Redirect to login page only if not already on the login page
//     if (req.originalUrl !== '/eval-api/login') {
//         return res.redirect('/eval-api/login');
//     }
//     next(); // Continue to the next middleware if already on the login page
// }

// // Instructor dashboard route
// router.get('/dashboard', checkAuthenticated, (req, res) => {
//     res.send('Evaluator Dashboard');
// });

// // Instructor login page route
// router.get('/login', (req, res) => {
//     res.send('Evaluator Login Page');
// });

// module.exports = router;
