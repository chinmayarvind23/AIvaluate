const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Fetch all prompts by instructor id
router.get('/prompts/:instructorId', async (req, res) => {
    try {
        const { instructorId } = req.params;
        const prompts = await pool.query(
            'SELECT * FROM "Prompt" WHERE "instructorId" = $1',
            [instructorId]
        );
        res.json(prompts.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
});

// Create a prompt
router.post('/prompt', async (req, res) => {
    try {
        const { promptName, promptText, instructorId } = req.body;
        const newPrompt = await pool.query(
            'INSERT INTO "Prompt" ( "promptName", "promptText", "instructorId") VALUES($1, $2, $3) RETURNING *',
            [promptName, promptText, instructorId]
        );
        res.json(newPrompt.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
});

// Delete a prompt
router.delete('/prompt/:promptid', async (req, res) => {
    try {
        const { promptId } = req.params;
        const deletePrompt = await pool.query(
            'DELETE FROM "Prompt" WHERE "promptId" = $1',
            [promptId]
        );
        res.json('Prompt was deleted');
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
});

// Update a prompt
router.put('/prompt/:promptid', async (req, res) => {
    try {
        const { promptId } = req.params;
        const { promptName, promptText } = req.body;
        const updatePrompt = await pool.query(
            'UPDATE "Prompt" SET "promptName" = $1, "promptText" = $2 WHERE "promptId" = $3 RETURNING *',
            [promptName, promptText, promptId]
        );
        res.json(updatePrompt.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
});

module.exports = router;
