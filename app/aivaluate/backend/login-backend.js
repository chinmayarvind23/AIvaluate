const express = require('express');
const router = express.Router();
const passport = require('passport');
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const cors = require('cors');

router.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Route to handle student login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).send({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).send({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return res.status(500).send({ message: 'Internal server error' });
            }
            return res.status(200).send({ message: 'Login successful' });
        });
    })(req, res, next);
});

// Route to handle student signup
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, major } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO "Student" (first_name, last_name, email, password, major) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, email, hashedPassword, major]
        );
        const user = result.rows[0];

        req.session.user = { id: user.studentId, email: user.email };

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
