const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const studentRoutes = require('../routes/studentRoutes');
const { pool } = require('../dbConfig');

// Mock data
const mockUser = { studentId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedpassword' };

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  req.isAuthenticated = () => true;
  req.user = mockUser;
  next();
});

app.use('/', studentRoutes);

describe('Student Routes', () => {
  afterAll(async () => {
    await pool.end();
  });

  test('GET /student/me - should return current student ID', async () => {
    const response = await request(app).get('/student/me');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ studentId: 1 });
  });

  test('GET /student/:studentId/firstName - should return student firstName', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [{ firstName: 'John' }] });
    const response = await request(app).get('/student/1/firstName');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ firstName: 'John' });
  });

  test('PUT /student/:studentId/firstName - should update student firstName', async () => {
    pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });
    const response = await request(app)  
      .put('/student/1/firstName')
      .send({ firstName: 'Jane' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'First name updated successfully' });
  });

  // Similar tests for lastName, email, and password

  test('GET /student/:studentId/lastName - should return student lastName', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [{ lastName: 'Doe' }] });
    const response = await request(app).get('/student/1/lastName');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ lastName: 'Doe' });
  });

  test('PUT /student/:studentId/lastName - should update student lastName', async () => {
    pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });
    const response = await request(app)
      .put('/student/1/lastName')
      .send({ lastName: 'Smith' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Last name updated successfully' });
  });

  test('GET /student/:studentId/email - should return student email', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [{ email: 'john.doe@example.com' }] });
    const response = await request(app).get('/student/1/email');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ email: 'john.doe@example.com' });
  });

  test('PUT /student/:studentId/email - should update student email', async () => {
    pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });
    const response = await request(app)
      .put('/student/1/email')
      .send({ email: 'jane.doe@example.com' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Email updated successfully' });
  });

  test('GET /student/:studentId/password - should return student password', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [{ password: 'hashedpassword' }] });
    const response = await request(app).get('/student/1/password');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ password: 'hashedpassword' });
  });

  test('PUT /student/:studentId/password - should update student password', async () => {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('newpassword', 10);
    pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });
    const response = await request(app)
      .put('/student/1/password')
      .send({ password: 'newpassword' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Password updated successfully' });
  });
});
