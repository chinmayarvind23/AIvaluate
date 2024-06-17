const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const accountRoutes = require('../routes/accountRoutes');
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

app.use('/', accountRoutes);

describe('Account Routes', () => {
  afterAll(async () => {
    await pool.end();
  });

  test('GET /users/me - should return current user details', async () => {
    pool.query = jest.fn().mockResolvedValue({
      rows: [{ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', studentId: 1 }]
    });

    const response = await request(app).get('/users/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      studentId: 1
    });
  }, 10000); 

  test('PUT /users/update - should update user details', async () => {
    pool.query = jest.fn().mockResolvedValue({
      rows: [{ firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', studentId: 1 }]
    });

    const response = await request(app)
      .put('/users/update')
      .send({ firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'newpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      studentId: 1
    });
  }, 10000); 
});
