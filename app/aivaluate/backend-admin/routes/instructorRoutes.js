const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
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





// Check if authenticated middleware
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin-api/login');
}

// // Get all evaluators
// router.get('/evaluators', checkAuthenticated, async (req, res) => {
//     try {
//         const result = await pool.query('SELECT "instructorId", "firstName", "lastName", "hasFullAccess" FROM "Instructor"');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching evaluators:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// Get evaluator details
router.get('/evaluator/:instructorId', checkAuthenticated, async (req, res) => {
    const { instructorId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evaluator not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching evaluator details:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get courses by evaluator
router.get('/evaluator/:instructorId/courses', checkAuthenticated, async (req, res) => {
    const { instructorId } = req.params;
    try {
        const result = await pool.query('SELECT "Course"."courseName","Course"."courseCode" FROM "Course"JOIN "Teaches" ON "Course"."courseId" = "Teaches"."courseId"WHERE "Teaches"."instructorId" = $1;', [instructorId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Register a new evaluator
router.post('/evaluatorRegister', checkAuthenticated, async (req, res) => {
    const { firstName, lastName, email, password, isTA, department } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert without specifying instructorId to let PostgreSQL handle it
        await pool.query(
            'INSERT INTO "Instructor" ("firstName", "lastName", "email", "password", "isTA", "department") VALUES ($1, $2, $3, $4, $5, $6)',
            [firstName, lastName, email, hashedPassword, isTA, department]
        );
        res.status(201).json({ message: 'Instructor registered successfully' });
    } catch (error) {
        console.error('Error registering instructor:', error);
        console.error('Request body:', req.body);
        if (error.stack) {
            console.error(error.stack);
        }
        res.status(500).json({ error: 'Database error' });
    }
});


// app.post("/stu-api/signup", async (req, res) => {
//     let { firstName, lastName, email, password, password2 } = req.body;

//     let errors = [];

//     if (!firstName || !lastName || !email || !password || !password2) {
//         errors.push({ message: "Please enter all fields" });
//     }

//     if (password.length < 6) {
//         errors.push({ message: "Password should be at least 6 characters long" });
//     }

//     if (password != password2) {
//         errors.push({ message: "Passwords do not match" });
//     }

//     if (errors.length > 0) {
//         return res.status(400).json({ errors });
//     } else {
//         let hashedPassword = await bcrypt.hash(password, 10);

//         pool.query(
//             'SELECT * FROM "Student" WHERE email = $1',
//             [email],
//             (err, results) => {
//                 if (err) {
//                     console.error('Error during SELECT:', err);
//                     return res.status(500).json({ errors: [{ message: "Database error" }] });
//                 }

//                 if (results.rows.length > 0) {
//                     errors.push({ message: "Email already registered" });
//                     return res.status(400).json({ errors });
//                 } else {
//                     pool.query(
//                         'INSERT INTO "Student" ("firstName", "lastName", email, password) VALUES ($1, $2, $3, $4) RETURNING "studentId", password',
//                         [firstName, lastName, email, hashedPassword],
//                         (err, results) => {
//                             if (err) {
//                                 console.error('Error during INSERT:', err);
//                                 return res.status(500).json({ errors: [{ message: "Database error" }] });
//                             }
//                             res.status(201).json({ message: "You are now registered. Please log in" });
//                         }
//                     );
//                 }
//             }
//         );
//     }
// });










// Delete evaluator
router.delete('/evaluator/:instructorId', checkAuthenticated, async (req, res) => {
    const { instructorId } = req.params;
    try {
        await pool.query('DELETE FROM "Instructor" WHERE "instructorId" = $1', [instructorId]);
        res.status(200).json({ message: 'Evaluator deleted successfully' });
    } catch (error) {
        console.error('Error deleting evaluator:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Remove course from evaluator
router.delete('/evaluator/:instructorId/drop/:courseCode', checkAuthenticated, async (req, res) => {
    const { instructorId, courseCode } = req.params;
    try {
        const dropQuery = ` DELETE FROM "Teaches" WHERE "instructorId" = $1 AND "courseId" = ( SELECT "courseId" FROM "Course" WHERE "courseCode" = $2)`;

            await pool.query(dropQuery, [instructorId,courseCode]);
        res.status(200).json({ message: 'Course removed from instructor successfully' });
    } catch (error) {
        console.error('Error removing course from evaluator:', error);
        res.status(500).json({ error: 'Database error' });
    }
});





router.put('/evaluator/:instructorId', checkAuthenticated, async (req, res) => {
    const { instructorId } = req.params;
    const { firstName, lastName, email } = req.body;

    console.log('Updating evaluator with ID:', instructorId); // Debugging line
    console.log('Received data:', req.body); // Debugging line

    try {
        const result = await pool.query(
            'UPDATE "Instructor" SET "firstName" = $1, "lastName" = $2, "email" = $3 WHERE "instructorId" = $4',
            [firstName, lastName, email, instructorId]
        );
        console.log('Update result:', result); // Debugging line
        res.status(200).json({ message: 'Evaluator updated successfully' });
    } catch (error) {
        console.error('Error updating evaluator:', error); // Detailed error logging
        res.status(500).json({ message: 'Server error' });
    }
});

// In your routes file

router.put('/evaluator/:id/role', async (req, res) => {
    const { id } = req.params;
    const { isTA } = req.body;

    try {
        await pool.query('UPDATE "Instructor" SET "isTA" = $1 WHERE "instructorId" = $2', [isTA, id]);
        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
