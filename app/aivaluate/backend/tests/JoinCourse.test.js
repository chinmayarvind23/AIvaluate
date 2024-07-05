// tests/instructorRoutes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mocking the database pool
const pool = {
  query: jest.fn()
};

const app = express();
app.use(bodyParser.json());

// Define the routes
app.get('/tas', async (req, res) => {
  try {
    const tas = await pool.query('SELECT * FROM "Instructor" WHERE "isTA" = TRUE');
    res.status(200).send(tas.rows);
  } catch (error) {
    console.error('Error fetching TAs:', error);
    res.status(500).send({ message: 'Error fetching TAs' });
  }
});

app.delete('/teaches/:courseId/:instructorId', async (req, res) => {
  const { courseId, instructorId } = req.params;
  try {
    await pool.query('DELETE FROM "Teaches" WHERE "courseId" = $1 AND "instructorId" = $2', [courseId, instructorId]);
    res.status(200).send({ message: 'Instructor/TA removed from course successfully' });
  } catch (error) {
    console.error('Error removing Instructor/TA from course:', error);
    res.status(500).send({ message: 'Error removing Instructor/TA from course' });
  }
});

describe('GET /tas', () => {
  it('should fetch all TAs', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [{ instructorId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', isTA: true }] });
    });

    const response = await request(app).get('/tas');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ instructorId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', isTA: true }]);
  });

  it('should return an error when fetching TAs', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).get('/tas');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching TAs' });
  });
});

describe('DELETE /teaches/:courseId/:instructorId', () => {
  it('should remove an instructor or TA from a course', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [] });
    });

    const response = await request(app).delete('/teaches/1/2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Instructor/TA removed from course successfully' });
  });

  it('should return an error when removing an instructor or TA from a course', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).delete('/teaches/1/2');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error removing Instructor/TA from course' });
  });
});
