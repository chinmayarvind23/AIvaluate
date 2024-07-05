const request = require('supertest');
const express = require('express');
jest.mock('../dbConfig', () => ({
  pool: {
    query: jest.fn()
  }
}));
const { pool } = require('../dbConfig');
const adminRoutes = require('../routes/adminRoutes');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

jest.mock('bcryptjs');
jest.mock('nodemailer');

const app = express();
app.use(express.json());
app.use(adminRoutes);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /admin-api/dashboard', () => {
  test('should return Admin Dashboard', async () => {
    const response = await request(app).get('/admin-api/dashboard');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Admin Dashboard');
  });
});

describe('POST /forgotpassword', () => {
  test('should return 404 if email not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const response = await request(app).post('/forgotpassword').send({ email: 'test@example.com' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'No account with that email found' });
  });


  test('should return 500 on server error', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));
    const response = await request(app).post('/forgotpassword').send({ email: 'test@example.com' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Server error' });
  });
});

describe('POST /reset/:token', () => {
  test('should return 400 if passwords do not match', async () => {
    const response = await request(app).post('/reset/sometoken').send({
      password: 'password123',
      confirmPassword: 'password321'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Passwords do not match' });
  });

  test('should return 400 if password is not strong enough', async () => {
    const response = await request(app).post('/reset/sometoken').send({
      password: '123',
      confirmPassword: '123'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Password must be longer than 6 characters and include a combination of letters and numbers'
    });
  });

  test('should return 400 if token is invalid or expired', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const response = await request(app).post('/reset/sometoken').send({
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Password reset token is invalid or has expired' });
  });

  test('should reset password if token is valid', async () => {
    const mockAdmin = { adminId: 1, email: 'test@example.com' };
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] });
    bcrypt.hash.mockResolvedValue('hashedpassword');
    pool.query.mockResolvedValueOnce({});

    const response = await request(app).post('/reset/sometoken').send({
      password: 'password123',
      confirmPassword: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Password has been reset successfully' });
  });

  test('should return 500 on server error', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));
    const response = await request(app).post('/reset/sometoken').send({
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Server error' });
  });
});

describe('GET /evaluators', () => {
  const checkAuthenticated = (req, res, next) => {
    req.isAuthenticated = () => true;
    req.user = { id: 1 };
    next();
  };

  app.get('/evaluators', checkAuthenticated, adminRoutes);

});
