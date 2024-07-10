const request = require('supertest');
const express = require('express');
// The following code is used to mock the database connection by creating a mock of the dbConfig module
jest.mock('../dbConfig', () => ({
  pool: {
    query: jest.fn()
  }
}));
const { pool } = require('../dbConfig');
const adminRoutes = require('../routes/adminRoutes');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs');
jest.mock('nodemailer');
//This is just to set up out express app and use the instructorRoutes
const app = express();
app.use(express.json());
app.use(adminRoutes);

// This simply clears all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /admin-api/dashboard', () => {
  test('should return Admin Dashboard', async () => {
    const response = await request(app).get('/admin-api/dashboard'); // Make a request to the endpoint
    expect(response.status).toBe(200); // Check if the response status is 200
    expect(response.text).toBe('Admin Dashboard'); // Check if the response body is the mock data
  });
});

describe('POST /forgotpassword', () => {
  test('should return 404 if email not found', async () => {
    pool.query.mockResolvedValue({ rows: [] }); // Mock the database query to return an empty array
    const response = await request(app).post('/forgotpassword').send({ email: 'test@example.com' }); // Make a request to the endpoint
    expect(response.status).toBe(404); // Check if the response status is 404
    expect(response.body).toEqual({ message: 'No account with that email found' }); // Check if the response body is the error message
  });


  test('should return 500 on server error', async () => {
    pool.query.mockRejectedValue(new Error('Database error')); // Mock the database query to throw an error
    const response = await request(app).post('/forgotpassword').send({ email: 'test@example.com' }); // Make a request to the endpoint
    expect(response.status).toBe(500); // Check if the response status is 500
    expect(response.body).toEqual({ message: 'Server error' }); // Check if the response body is the error message
  });
});

describe('POST /reset/:token', () => {
  test('should return 400 if passwords do not match', async () => {
    const response = await request(app).post('/reset/sometoken').send({  // Make a request to the endpoint
      password: 'password123',
      confirmPassword: 'password321'
    }); 
    expect(response.status).toBe(400); // Check if the response status is 400
    expect(response.body).toEqual({ message: 'Passwords do not match' }); // Check if the response body is the error message
  });

  test('should return 400 if password is not strong enough', async () => {
    const response = await request(app).post('/reset/sometoken').send({ // Make a request to the endpoint
      password: '123',
      confirmPassword: '123'
    });
    expect(response.status).toBe(400); // Check if the response status is 400
    expect(response.body).toEqual({ // Check if the response body is the error message
      message: 'Password must be longer than 6 characters and include a combination of letters and numbers'
    });
  });

  test('should return 400 if token is invalid or expired', async () => {
    pool.query.mockResolvedValue({ rows: [] }); // Mock the database query to return an empty array
    const response = await request(app).post('/reset/sometoken').send({ // Make a request to the endpoint
      password: 'password123',
      confirmPassword: 'password123'
    }); 
    expect(response.status).toBe(400); // Check if the response status is 400
    expect(response.body).toEqual({ message: 'Password reset token is invalid or has expired' }); // Check if the response body is the error message
  });

  test('should reset password if token is valid', async () => {
    const mockAdmin = { adminId: 1, email: 'test@example.com' }; // Mock data
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] }); // Mock the database query to return the mock data
    bcrypt.hash.mockResolvedValue('hashedpassword'); // Mock the bcrypt hash function
    pool.query.mockResolvedValueOnce({}); // Mock the database query to return an empty object

    const response = await request(app).post('/reset/sometoken').send({ // Make a request to the endpoint
      password: 'password123', // Send the password and confirm password
      confirmPassword: 'password123' // Send the password and confirm password
    });

    expect(response.status).toBe(200); // Check if the response status is 200
    expect(response.body).toEqual({ message: 'Password has been reset successfully' }); // Check if the response body is the success message
  });

  test('should return 500 on server error', async () => {
    pool.query.mockRejectedValue(new Error('Database error')); // Mock the database query to throw an error
    const response = await request(app).post('/reset/sometoken').send({ // Make a request to the endpoint
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(response.status).toBe(500); // Check if the response status is 500
    expect(response.body).toEqual({ message: 'Server error' }); // Check if the response body is the error message
  });
});

describe('GET /evaluators', () => {
  const checkAuthenticated = (req, res, next) => { // Mock the checkAuthenticated middleware
    req.isAuthenticated = () => true;
    req.user = { id: 1 };
    next();
  };

  app.get('/evaluators', checkAuthenticated, adminRoutes); 

});
