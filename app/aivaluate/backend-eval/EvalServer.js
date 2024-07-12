const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const { pool } = require('./dbConfig');
const bcrypt = require('bcryptjs'); 
const session = require('express-session');
const flash = require("express-flash");
const bodyParser = require('body-parser');
const passport = require("passport");

const evalRoutes = require('./routes/evalRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const studentRoutes = require('./routes/studentRoutes');

const initializePassport = require("./passportConfig");

initializePassport(passport);

const PORT = process.env.PORT || 6000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, continue to the next middleware
    }
    // Redirect to login page only if not already on the login page
    if (req.originalUrl !== '/eval-api/login') {
        return res.redirect('/eval-api/login');
    }
    next(); // Continue to the next middleware if already on the login page
}

app.get("/eval-api/dashboard", checkAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

app.use('/eval-api', evalRoutes);
app.use('/eval-api', courseRoutes);
app.use('/eval-api', assignmentRoutes);
app.use('/eval-api', instructorRoutes);
app.use('/eval-api', gradeRoutes);
app.use('/eval-api', studentRoutes);

app.post("/eval-api/login", passport.authenticate("local", {
    successRedirect: "/eval-api/dashboard",
    failureRedirect: "/eval-api/login",
    failureFlash: true
}));

app.get('/eval-api/logout', (req, res, next) => {
    console.log('Attempting to logout...');
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.flash('success_msg', "You have successfully logged out");
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return next(err);
            }
            res.clearCookie('connect.sid');
            console.log('Logout successful');
            res.redirect('/eval-api/login');
        });
    });
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/eval-api/login");
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
