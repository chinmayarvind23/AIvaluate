const pool = require('../app/aivaluate/database/dbConnect');

beforeAll(async () => {
  // Initialize the database schema and seed data if necessary
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)
    );
  `);
});

afterAll(async () => {
  // Clean up the database
  await pool.query('DROP TABLE IF EXISTS users;');
  await pool.end();
});

describe('Database tests', () => {
  test('should insert a user into the database', async () => {
    const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', ['John Doe']);
    expect(result.rows[0]).toHaveProperty('id');
    expect(result.rows[0].name).toBe('John Doe');
  });

  test('should retrieve a user from the database', async () => {
    const result = await pool.query('SELECT * FROM users WHERE name = $1', ['John Doe']);
    expect(result.rows[0].name).toBe('John Doe');
  });
});
