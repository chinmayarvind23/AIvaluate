const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aivaluate',
    password: 'aivaluate',
    port: 5432,
});

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Define your API routes here
app.get('/api/data', async (req, res) => {
    try {
        // Query the database
        const result = await pool.query('SELECT * FROM your_table');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});