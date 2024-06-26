const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const { app, server } = require('../server'); // Adjust the path as necessary
const { pool } = require('../dbConfig');

afterAll(done => {
    server.close(() => {
        pool.end().then(() => done());
    });
});

describe('Database Connectivity', () => {
    it('should return the current time from the database', async () => {
        const response = await request(app).get('/test-db');
        console.log('Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body).toHaveProperty('time');
    });

    it('should handle database errors gracefully', async () => {
        const originalQuery = pool.query;
        pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/test-db');
        expect(response.status).toBe(500);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Database error');

        pool.query = originalQuery;
    });
});

describe('User Authentication and Registration', () => {
    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/stu/signup')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                password2: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('You are now registered. Please log in');
    });

    it('should prevent registration with an existing email', async () => {
        const response = await request(app)
            .post('/stu/signup')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                password2: 'password123'
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Email already registered' })
            ])
        );
    });

    it('should log in successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/stu/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(302); // Redirect status
        expect(response.headers.location).toBe('/stu/dashboard');
    });

    it('should fail to log in with invalid credentials', async () => {
        const response = await request(app)
            .post('/stu/login')
            .send({
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(302); // Redirect status
        expect(response.headers.location).toBe('/stu/login');
    });

    it('should not register a user with missing fields', async () => {
        const response = await request(app)
            .post('/stu/signup')
            .send({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                password2: ''
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Please enter all fields' })
            ])
        );
    });

    it('should not register a user with passwords less than 6 characters', async () => {
        const response = await request(app)
            .post('/stu/signup')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'shortpass@example.com',
                password: '123',
                password2: '123'
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Password should be at least 6 characters long' })
            ])
        );
    });

    it('should not log in with an incorrect password', async () => {
        const response = await request(app)
            .post('/stu/login')
            .send({
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(302); // Redirect status
        expect(response.headers.location).toBe('/stu/login');
    });

    it('should not log in with a non-registered email', async () => {
        const response = await request(app)
            .post('/stu/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(302); // Redirect status
        expect(response.headers.location).toBe('/stu/login');
    });
});
