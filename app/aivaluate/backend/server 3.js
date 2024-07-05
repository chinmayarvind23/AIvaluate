const path = require('path');
const cors = require('cors');
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const passport = require("passport");
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const initializePassport = require("./passportConfig");
// Session storage imports
const express = require('express');
const session = require('express-session');
const flash = require("express-flash");
// const Sequelize = require('sequelize');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();
const PORT = process.env.PORT || 4000;

// const sequelize = new Sequelize('database', 'username', 'password', {
//     host: 'localhost',
//     dialect: 'postgres', // Correct dialect for PostgreSQL
//     logging: false, // Optional: disable logging for Sequelize queries
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

// Configure session middleware
app.use(session({
    secret: 'secret',
    // store: new SequelizeStore({
    //     db: sequelize
    // }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// app.use(
//     session({
//         secret: 'secret',
//         resave: false,
//         saveUninitialized: false
//     })
// );

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Number of views: ${req.session.views}`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh!');
    }
});

// Sync database and start server
// sequelize.sync()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

initializePassport(passport);





app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(courseRoutes);
app.use(studentRoutes);

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
  };
  
  app.use(cors(corsOptions));

app.post("/stu/signup", async (req, res) => {
    let { firstName, lastName, email, password, password2 } = req.body;

    let errors = [];

    if (!firstName || !lastName || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters long" });
    }

    if (password != password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            'SELECT * FROM "Student" WHERE email = $1',
            [email],
            (err, results) => {
                if (err) {
                    console.error('Error during SELECT:', err);
                    return res.status(500).json({ errors: [{ message: "Database error" }] });
                }

                if (results.rows.length > 0) {
                    errors.push({ message: "Email already registered" });
                    return res.status(400).json({ errors });
                } else {
                    pool.query(
                        'INSERT INTO "Student" ("firstName", "lastName", email, password) VALUES ($1, $2, $3, $4) RETURNING "studentId", password',
                        [firstName, lastName, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                console.error('Error during INSERT:', err);
                                return res.status(500).json({ errors: [{ message: "Database error" }] });
                            }
                            res.status(201).json({ message: "You are now registered. Please log in" });
                        }
                    );
                }
            }
        );
    }
});

app.post("/stu/login", passport.authenticate("local", { // Use local strategy for authentication using email and password fields in request body sent from client side to server side using POST request
    successRedirect: "/stu/dashboard", // Redirect to dashboard on successful login
    failureRedirect: "/stu/login", // Redirect to login page on failed login
    failureFlash: true // Enable flash messages for failed login attempts to display error message to user
}));

app.get("/stu/dashboard", checkNotAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

// app.get('/stu/logout', (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success_msg', "You have successfully logged out");
//         req.session.destroy((err) => {
//             if (err) {
//                 return next(err);
//             }
//             res.clearCookie('connect.sid');
//             // res.redirect('/stu/login');
//             res.redirect('http://localhost:5173/stu/login');
//         });
//     });
// });

app.get('/stu/logout', (req, res) => {
    req.logout(); // Clear login session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.clearCookie('connect.sid', { path: '/' }); // Clear session cookie
        res.status(200).json({ message: 'Logout successful' });
      }
    });
  });
  

// app.get('/stu/logout', (req, res, next) => {
//     req.logout(); // Provided by Passport to clear the login session
//     req.session.destroy((err) => {
//         if (err) {
//             return next(err);
//         }
//         res.clearCookie('connect.sid'); // Clear session cookie
//         res.redirect('http://localhost:5173/stu/login'); // Redirect to login page
//     });
// });


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/stu/dashboard');
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/stu/login");
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/stu/login');
}
