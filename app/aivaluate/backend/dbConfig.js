require('dotenv').config();

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Ensure the environment variables are correctly loaded
//console.log('Database configuration:', {
   // user: process.env.DB_USER,
   // host: process.env.DB_HOST_LOCALHOST,
  //  port: process.env.DB_PORT,
 //   database: process.env.DB_DATABASE,
//});

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_LOCALHOST}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

module.exports = { pool };