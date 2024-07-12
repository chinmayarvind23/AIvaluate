const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');

// Get Evaluator Details
router.get('/evaluator/:id', async (req, res) => {
  const evaluatorId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM "Instructor" WHERE "instructorId" = $1', [evaluatorId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evaluator not found' });
    }
    const evaluator = result.rows[0];
    evaluator.passwordLength = evaluator.userPassword.length;
    res.json(evaluator);
  } catch (error) {
    console.error('Error fetching evaluator details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a new Evaluator
router.post('/evaluator', async (req, res) => {
  const { firstname, lastname, email, password, department, hasFullAccess } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO "Instructor" ("firstName", "lastName", "email", "userPassword", "department", "hasFullAccess") VALUES ($1, $2, $3, $4, $5, $6)',
      [firstname, lastname, email, hashedPassword, department, hasFullAccess]
    );
    res.status(201).json({ message: 'Evaluator registered successfully' });
  } catch (error) {
    console.error('Error registering evaluator:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Evaluator
router.delete('/evaluator/:id', async (req, res) => {
  const evaluatorId = req.params.id;

  try {
    await pool.query('DELETE FROM "Instructor" WHERE "instructorId" = $1', [evaluatorId]);
    res.status(200).json({ message: 'Evaluator deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluator:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Courses by Evaluator
router.get('/evaluator/:id/courses', async (req, res) => {
  const evaluatorId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT "courseId", "courseCode", "courseName" FROM "Course" WHERE "instructorId" = $1',
      [evaluatorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove Course from Evaluator
router.delete('/evaluator/:id/course/:courseId', async (req, res) => {
  const { id: evaluatorId, courseId } = req.params;

  try {
    await pool.query(
      'UPDATE "Course" SET "instructorId" = NULL WHERE "courseId" = $1 AND "instructorId" = $2',
      [courseId, evaluatorId]
    );
    res.status(200).json({ message: 'Course removed from evaluator successfully' });
  } catch (error) {
    console.error('Error removing course from evaluator:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
