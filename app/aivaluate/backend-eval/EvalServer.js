const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const flash = require("express-flash");
const bodyParser = require('body-parser');
const passport = require("passport");
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const studentRoutes = require('./routes/studentRoutes');
const promptRoutes = require('./routes/promptRoutes');
const evalRoutes = require('./routes/evalRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

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
        maxAge: 1000 * 60 * 60 * 24,
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

app.use((req, res, next) => {
    if (!req.session.courseId && req.body.courseId) {
        req.session.courseId = req.body.courseId;
    }
    if (!req.session.instructorId && req.body.instructorId) {
        req.session.instructorId = req.body.instructorId;
    }
    next();
});

// Function to check if user is authenticated (can be used for protected routes)
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, continue to the next middleware
    }
    res.redirect('/eval-api/login');
}

app.get("/eval-api/dashboard", checkAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        req.session.instructorId = req.user.instructorId;
        res.json({ user: req.user });
    } else {
        res.redirect("/eval-api/login");
    }
});

app.use('/eval-api', evalRoutes);
app.use('/eval-api', courseRoutes);
app.use('/eval-api', assignmentRoutes);
app.use('/eval-api', instructorRoutes);
app.use('/eval-api', gradeRoutes);
app.use('/eval-api', studentRoutes);
app.use('/eval-api', promptRoutes);
app.use('/eval-api', submissionRoutes);

app.post("/eval-api/login", passport.authenticate("local", {
    successRedirect: "/eval-api/dashboard",
    failureRedirect: "/eval-api/login",
    failureFlash: true
}));

app.get("/eval-api/dashboard", checkAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        req.session.instructorId = req.user.instructorId;
        res.json({ user: req.user });
    } else {
        res.redirect("/eval-api/login");
    }
});

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

app.post('/eval-api/set-course', (req, res) => {
    const { courseId, instructorId } = req.body;
    if (!courseId || !instructorId) {
        return res.status(400).json({ message: 'Course ID and Instructor ID are required' });
    }
    req.session.courseId = courseId;
    req.session.instructorId = instructorId;
    res.status(200).json({ message: 'Course ID and Instructor ID set in session', courseId, instructorId });
});

function ensureCourseAndInstructor(req, res, next) {
    if (!req.session.courseId || !req.session.instructorId) {
        return res.status(400).json({ message: 'Course ID and Instructor ID must be set in session' });
    }
    next();
}

app.use('/eval-api/rubrics', ensureCourseAndInstructor, courseRoutes);
app.use('/eval-api/assignments', ensureCourseAndInstructor, assignmentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});