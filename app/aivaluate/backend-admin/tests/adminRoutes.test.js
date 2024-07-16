const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const logger = require('../adminlogger'); // Ensure this path is correct

// Mock the pg module correctly
jest.mock('pg', () => ({
    Pool: jest.fn(() => ({
        query: jest.fn()
    }))
}));

const pool = new Pool();

const app = express();
app.use(bodyParser.json());

const checkAuthenticated = (req, res, next) => {
    req.isAuthenticated = () => true; // Assume user is always authenticated for testing
    next();
};

app.use(checkAuthenticated);

app.get('/evaluators', async (req, res) => {
    try {
        const query = `
            SELECT "firstName", "lastName", "isTA"
            FROM "Instructor"
        `;
        const result = await pool.query(query);
        const evaluators = result.rows.map(row => ({
            name: `${row.firstName} ${row.lastName}`,
            TA: row.isTA
        }));
        res.json(evaluators);
    } catch (err) {
        logger.error('Error fetching evaluators: ' + err.message);
        res.status(500).json({ error: 'Database error' });
    }
});



app.get('/admin/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.status(200).json({ adminId: req.user.adminId });
});

app.get('/admin/:adminId/firstName', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "firstName" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ firstName: result.rows[0].firstName });
    } catch (error) {
        logger.error('Error fetching admin firstName: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define the route to fetch admin last name by admin ID
app.get('/admin/:adminId/lastName', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "lastName" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.status(200).json({ lastName: result.rows[0].lastName });
    } catch (error) {
        logger.error('Error fetching admin lastName: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/admin/:adminId/email', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "email" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.status(200).json({ email: result.rows[0].email });
    } catch (error) {
        logger.error('Error fetching admin email: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define the route to fetch admin password by admin ID
app.get('/admin/:adminId/password', async (req, res) => {
    const adminId = parseInt(req.params.adminId);

    try {
        const result = await pool.query('SELECT "password" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }
        res.status(200).json({ password: result.rows[0].password });
    } catch (error) {
        logger.error('Error fetching admin password: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define the route to verify admin password by admin ID
app.post('/admin/:adminId/verifyPassword', async (req, res) => {
    const adminId = parseInt(req.params.adminId);
    const { currentPassword } = req.body;

    try {
        const result = await pool.query('SELECT "password" FROM "SystemAdministrator" WHERE "adminId" = $1', [adminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
        if (isMatch) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        logger.error('Error verifying password: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/admin/:adminId/password', async (req, res) => {
    const adminId = parseInt(req.params.adminId);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query('UPDATE "SystemAdministrator" SET "password" = $1 WHERE "adminId" = $2', [hashedPassword, adminId]);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        logger.error('Error updating admin password: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


describe('Evaluator Management Routes', () => {
    it('should fetch all evaluators', async () => {
        const mockEvaluators = [
            { firstName: 'John', lastName: 'Doe', isTA: false },
            { firstName: 'Jane', lastName: 'Smith', isTA: true }
        ];

        pool.query.mockResolvedValue({
            rows: mockEvaluators
        });

        const response = await request(app).get('/evaluators');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { name: 'John Doe', TA: false },
            { name: 'Jane Smith', TA: true }
        ]);
    });

    it('should return a database error when fetching evaluators', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/evaluators');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });
    });


    describe('Admin Identity Routes', () => {
        it('should fetch the current admin ID', async () => {
            const response = await request(app).get('/admin/me');
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ adminId: '123' });
        });
    
        it('should return a 401 error if not authenticated', async () => {
            // Modify isAuthenticated to return false for this test case
            app.use((req, res, next) => {
                req.isAuthenticated = () => false;
                next();
            });
    
            const response = await request(app).get('/admin/me');
    
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Not authenticated' });
        });
    });


    // Tests for Admin Routes
describe('Admin Routes', () => {
    it('should fetch the first name of the admin by admin ID', async () => {
        const mockAdmin = { firstName: 'John' };
        pool.query.mockResolvedValue({ rows: [mockAdmin], rowCount: 1 });

        const response = await request(app).get('/admin/123/firstName');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ firstName: 'John' });
    });

    it('should return a 404 error if the admin is not found', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const response = await request(app).get('/admin/999/firstName');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Admin not found' });
    });

    it('should handle database errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/admin/123/firstName');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

// Tests for Admin Routes related to last names
describe('Admin Last Name Routes', () => {
    it('should fetch the last name of the admin by admin ID', async () => {
        const mockAdmin = { lastName: 'Doe' };
        pool.query.mockResolvedValue({ rows: [mockAdmin], rowCount: 1 });

        const response = await request(app).get('/admin/123/lastName');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ lastName: 'Doe' });
    });

    it('should return a 404 error if the admin is not found', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const response = await request(app).get('/admin/999/lastName');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'admin not found' });
    });

    it('should handle database errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/admin/123/lastName');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

// Tests for Admin Email Routes
describe('Admin Email Routes', () => {
    it('should fetch the email of the admin by admin ID', async () => {
        const mockAdmin = { email: 'admin@example.com' };
        pool.query.mockResolvedValue({ rows: [mockAdmin], rowCount: 1 });

        const response = await request(app).get('/admin/123/email');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ email: 'admin@example.com' });
    });

    it('should return a 404 error if the admin is not found', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const response = await request(app).get('/admin/999/email');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'admin not found' });
    });

    it('should handle database errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/admin/123/email');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

// Tests for Admin Password Routes
describe('Admin Password Routes', () => {
    it('should fetch the password of the admin by admin ID', async () => {
        const mockAdmin = { password: 'encryptedPassword123' };
        pool.query.mockResolvedValue({ rows: [mockAdmin], rowCount: 1 });

        const response = await request(app).get('/admin/123/password');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ password: 'encryptedPassword123' });
    });

    it('should return a 404 error if the admin is not found', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const response = await request(app).get('/admin/999/password');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'admin not found' });
    });

    it('should handle database errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/admin/123/password');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

// Tests for Admin Password Verification Route
describe('Admin Password Verification Route', () => {
    it('should verify the password of the admin by admin ID correctly', async () => {
        bcrypt.compare.mockResolvedValue(true);
        pool.query.mockResolvedValue({ rows: [{ password: 'hashedPassword123' }], rowCount: 1 });

        const response = await request(app).post('/admin/123/verifyPassword').send({ currentPassword: 'testPassword' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it('should return false if the password is incorrect', async () => {
        bcrypt.compare.mockResolvedValue(false);
        pool.query.mockResolvedValue({ rows: [{ password: 'hashedPassword123' }], rowCount: 1 });

        const response = await request(app).post('/admin/123/verifyPassword').send({ currentPassword: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, message: 'Incorrect password' });
    });

    it('should return a 404 error if the admin is not found', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const response = await request(app).post('/admin/999/verifyPassword').send({ currentPassword: 'anyPassword' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'admin not found' });
    });

    it('should handle database errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).post('/admin/123/verifyPassword').send({ currentPassword: 'anyPassword' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

// Tests for Admin Password Update Route
describe('Admin Password Update Route', () => {
    it('should update the admin password successfully', async () => {
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        pool.query.mockResolvedValue({ rowCount: 1 });

        const response = await request(app).put('/admin/123/password').send({ password: 'newPassword' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Password updated successfully' });
    });

    it('should handle errors during password update', async () => {
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).put('/admin/123/password').send({ password: 'newPassword' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

});

module.exports = app; // Exporting for testing purposes
