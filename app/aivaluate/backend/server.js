const express = require('express');
const app = express();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const initializePassport = require('./passportConfig');

initializePassport(passport);

const PORT = process.env.PORT || 4000;

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse JSON bodies

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// app.post('/stu/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM "Student" WHERE email = $1', [email]);
//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     if (await bcrypt.compare(password, user.password)) {
//       req.session.user = { id: user.studentId, email: user.email };
//       return res.status(200).json({ message: 'Login successful' });
//     } else {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     client.release();
//   }
// });

app.post('/stu/login', passport.authenticate('local', {
  successRedirect: '/dashboard', // Redirect on successful login
  failureRedirect: '/stu/login', // Redirect on failed login
  failureFlash: true, // Enable flash messages for failure cases
}));

app.post('/stu/signup', async (req, res) => {
  const { firstName, lastName, email, password, major } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO "Student" (first_name, last_name, email, password, major) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, lastName, email, hashedPassword, major]
    );
    const user = result.rows[0];

    req.session.user = { id: user.studentId, email: user.email }; // Set user session after signup

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/dashboard');
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
