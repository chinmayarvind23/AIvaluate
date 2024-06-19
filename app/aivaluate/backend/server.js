const express = require('express');
const { Pool } = require('pg');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aivaluate',
    password: 'aivaluate',
    port: 5432,
});

app.get('/data', async (req, res) => {
    try {
        // Query the database
        const result = await pool.query('SELECT * FROM assignments');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});