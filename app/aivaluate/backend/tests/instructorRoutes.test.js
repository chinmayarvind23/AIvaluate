// tests/instructorRoutes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mocking the database pool
const pool = {
  query: jest.fn()
};

// Mocking the authentication middleware
const checkAuthenticated = (req, res, next) => {
  req.user = { studentId: '1' }; // Mocked user
  next();
};

const app = express();
app.use(bodyParser.json());

// Setting up the express app and routes
const instructorRoutes = require('../routes/instructorRoutes'); // Adjust the path as necessary
app.use('/', instructorRoutes);

describe('Instructor Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /instructors', () => {
    it('should fetch all instructors', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ instructorId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', isTA: false }] }));

      const response = await request(app).get('/instructors');

      console.log('GET /instructors response:', response.body); // Added logging

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ instructorId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', isTA: false }]);
    });

    it('should return an error when fetching instructors', async () => {
      pool.query.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

      const response = await request(app).get('/instructors');

      console.log('GET /instructors error response:', response.body); // Added logging
      console.log('Error stack:', response.error); // Log the error stack

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching courses' });
    });
  });

  describe('GET /tas', () => {
    it('should fetch all TAs', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ instructorId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', isTA: true }] }));

      const response = await request(app).get('/tas');

      console.log('GET /tas response:', response.body); // Added logging

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ instructorId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', isTA: true }]);
    });

    it('should return an error when fetching TAs', async () => {
      pool.query.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

      const response = await request(app).get('/tas');

      console.log('GET /tas error response:', response.body); // Added logging
      console.log('Error stack:', response.error); // Log the error stack

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching TAs' });
    });
  });

  describe('POST /teaches', () => {
    it('should add an instructor or TA to a course', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app)
        .post('/teaches')
        .send({ courseId: 1, instructorId: 2 });

      console.log('POST /teaches response:', response.body); // Added logging

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Instructor/TA added to course successfully' });
    });

    it('should return an error when adding an instructor or TA to a course', async () => {
      pool.query.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

      const response = await request(app)
        .post('/teaches')
        .send({ courseId: 1, instructorId: 2 });

      console.log('POST /teaches error response:', response.body); // Added logging
      console.log('Error stack:', response.error); // Log the error stack

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error adding Instructor/TA to course' });
    });
  });

  describe('DELETE /teaches/:courseId/:instructorId', () => {
    it('should remove an instructor or TA from a course', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).delete('/teaches/1/2');

      console.log('DELETE /teaches response:', response.body); // Added logging

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Instructor/TA removed from course successfully' });
    });

    it('should return an error when removing an instructor or TA from a course', async () => {
      pool.query.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

      const response = await request(app).delete('/teaches/1/2');

      console.log('DELETE /teaches error response:', response.body); // Added logging
      console.log('Error stack:', response.error); // Log the error stack

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error removing Instructor/TA from course' });
    });
  });
});
