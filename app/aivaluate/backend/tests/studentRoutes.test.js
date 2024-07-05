// tests/studentRoutes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const studentRoutes = require('../routes/studentRoutes');

// Mock the database pool
const pool = {
  query: jest.fn(),
};

// Mock the authentication
const checkAuthenticated = (req, res, next) => {
  req.isAuthenticated = () => true;
  req.user = { studentId: 1 };
  next();
};

const app = express();
app.use(bodyParser.json());
app.use('/stu-api', studentRoutes);

// Mock nodemailer
jest.mock('nodemailer');
const sendMail = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail });

describe('Student Routes', () => {
  describe('GET /users/me', () => {
    it('should fetch user details', async () => {
      pool.query.mockImplementationOnce((text, params, callback) => {
        callback(null, { rows: [{ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', studentId: 1 }] });
      });

      const response = await request(app).get('/stu-api/users/me').use(checkAuthenticated);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', studentId: 1 });
    });



      const response = await request(app).get('/stu-api/users/me').use(checkAuthenticated);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });

  });

  describe('PUT /users/update', () => {
    it('should update user details', async () => {
      pool.query.mockImplementationOnce((text, params, callback) => {
        callback(null, { rows: [{ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', studentId: 1 }] });
      });

      const response = await request(app)
        .put('/stu-api/users/update')
        .use(checkAuthenticated)
        .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'newpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', studentId: 1 });
    });

 

      const response = await request(app)
        .put('/stu-api/users/update')
        .use(checkAuthenticated)
        .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'newpassword' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });


  });

  describe('GET /student/me', () => {
    it('should get current student ID', async () => {
      const response = await request(app).get('/stu-api/student/me').use(checkAuthenticated);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ studentId: 1 });
    });

  });

  describe('GET /student/:studentId/firstName', () => {
    it('should fetch student firstName', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ firstName: 'John' }] }));

      const response = await request(app).get('/stu-api/student/1/firstName');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ firstName: 'John' });
    });
  });

  describe('PUT /student/:studentId/firstName', () => {
    it('should update student firstName', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).put('/stu-api/student/1/firstName').send({ firstName: 'John' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'First name updated successfully' });
    });

  });

  describe('GET /student/:studentId/lastName', () => {
    it('should fetch student lastName', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ lastName: 'Doe' }] }));

      const response = await request(app).get('/stu-api/student/1/lastName');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ lastName: 'Doe' });
    });


  });

  describe('PUT /student/:studentId/lastName', () => {
    it('should update student lastName', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).put('/stu-api/student/1/lastName').send({ lastName: 'Doe' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Last name updated successfully' });
    });

  });

  describe('GET /student/:studentId/email', () => {
    it('should fetch student email', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ email: 'john.doe@example.com' }] }));

      const response = await request(app).get('/stu-api/student/1/email');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ email: 'john.doe@example.com' });
    });


  });

  describe('PUT /student/:studentId/email', () => {
    it('should update student email', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).put('/stu-api/student/1/email').send({ email: 'john.doe@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Email updated successfully' });
    });
  });

  describe('GET /student/:studentId/password', () => {
    it('should fetch student password', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ password: 'hashedpassword' }] }));

      const response = await request(app).get('/stu-api/student/1/password');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ password: 'hashedpassword' });
    });

  });

  describe('POST /student/:studentId/verifyPassword', () => {
    it('should verify student password', async () => {
      const hashedPassword = await bcrypt.hash('currentpassword', 10);
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ password: hashedPassword }] }));

      const response = await request(app).post('/stu-api/student/1/verifyPassword').send({ currentPassword: 'currentpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });


  });

  describe('PUT /student/:studentId/password', () => {
    it('should update student password', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).put('/stu-api/student/1/password').send({ password: 'newpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Password updated successfully' });
    });

  });

  describe('POST /stu/forgotpassword', () => {
    it('should send recovery email if account exists', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ studentId: 1, email: 'john.doe@example.com' }] }));
      sendMail.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).post('/stu-api/stu/forgotpassword').send({ email: 'john.doe@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Recovery email sent' });
    });

    it('should return 404 if no account with that email found', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [] }));

      const response = await request(app).post('/stu-api/stu/forgotpassword').send({ email: 'john.doe@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No account with that email found' });
    });

  });

  describe('POST /stu/reset/:token', () => {
    it('should reset password successfully', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ studentId: 1 }] }));
      pool.query.mockImplementationOnce(() => Promise.resolve());

      const response = await request(app).post('/stu-api/stu/reset/token').send({
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Password has been reset successfully' });
    });


  });

  describe('GET /students/display/:courseId', () => {
    it('should fetch students for a course', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({ rows: [{ firstName: 'John', lastName: 'Doe' }] }));

      const response = await request(app).get('/stu-api/students/display/1').use(checkAuthenticated);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ firstName: 'John', lastName: 'Doe' }]);
    });

  });

  describe('GET /stu/submissions/:courseId/:studentId', () => {
    it('should fetch submissions for a student and course', async () => {
      pool.query.mockImplementationOnce(() => Promise.resolve({
        rows: [{
          assignmentSubmissionId: 1,
          assignmentId: 1,
          submittedAt: '2023-01-01T00:00:00Z',
          submissionFile: 'file.pdf',
          isSubmitted: true,
          updatedAt: '2023-01-02T00:00:00Z',
          isGraded: false,
          assignmentKey: 'key',
          assignmentDescription: 'desc',
        }]
      }));

      const response = await request(app).get('/stu-api/stu/submissions/1/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{
        assignmentSubmissionId: 1,
        assignmentId: 1,
        submittedAt: '2023-01-01T00:00:00Z',
        submissionFile: 'file.pdf',
        isSubmitted: true,
        updatedAt: '2023-01-02T00:00:00Z',
        isGraded: false,
        assignmentKey: 'key',
        assignmentDescription: 'desc',
      }]);
    });

  });
});
