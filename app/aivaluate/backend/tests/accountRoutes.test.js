const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// This is the mocking the database pool
const pool = {
  query: jest.fn()
};

// This is the mocking the authentication
const checkAuthenticated = (req, res, next) => {
  req.user = { studentId: '1' }; // Mocked user
  next();
};

const app = express();
app.use(bodyParser.json());

// This is the mocking the accountRoutes
app.get('/users/me', checkAuthenticated, (req, res) => {
  const userId = req.user.studentId;

  pool.query(
    'SELECT "firstName", "lastName", email, "studentId" FROM "Student" WHERE "studentId" = $1',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error fetching user details:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.rows.length > 0) {
        res.json(results.rows[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  );
});

app.put('/users/update', checkAuthenticated, async (req, res) => {
  const userId = req.user.studentId;
  const { firstName, lastName, email, password } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    pool.query(
      `UPDATE "Student" 
       SET "firstName" = $1, "lastName" = $2, email = $3, "password" = COALESCE($4, "password")
       WHERE "studentId" = $5
       RETURNING "firstName", "lastName", email, "studentId"`,
      [firstName, lastName, email, hashedPassword, userId],
      (err, results) => {
        if (err) {
          console.error('Error updating user details:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(results.rows[0]);
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

describe('GET /users/me', () => {
  it('should fetch user details', async () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      studentId: '1'
    };
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [mockUser] }); 
    });

    const response = await request(app).get('/users/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should return 404 if user not found', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [] }); 
    });

    const response = await request(app).get('/users/me');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  it('should return 500 on database error', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).get('/users/me');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});

describe('PUT /users/update', () => {
  it('should update user details', async () => {
    const mockUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      studentId: '1'
    };
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [mockUser] });
    });

    const response = await request(app)
      .put('/users/update')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should hash password if provided', async () => {
    const mockUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      studentId: '1'
    };
    const mockHashedPassword = 'hashedpassword';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashedPassword);
    pool.query.mockImplementation((text, params, callback) => {
      callback(null, { rows: [mockUser] });
    });

    const response = await request(app)
      .put('/users/update')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'newpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
  });

  it('should return 500 on database error', async () => {
    pool.query.mockImplementation((text, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .put('/users/update')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com'
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
