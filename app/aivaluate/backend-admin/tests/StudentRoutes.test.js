const request = require('supertest');
const express = require('express');
const { pool } = require('../dbConfig');
const studentRoutes = require('../routes/studentRoutes');

const app = express();
app.use(express.json());
app.use('/admin-api', studentRoutes);

afterAll(async () => {
    await pool.end();
});

describe('GET /admin-api/students', () => {
    test('Should return all students', async () => {
        const response = await request(app).get('/admin-api/students');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { studentId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password1', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'password2', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', password: 'password3', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 4, firstName: 'Omar', lastName: 'Hemed', email: 'omar@email.com', password: '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 5, firstName: 'Colton', lastName: 'Palfrey', email: 'colton@email.com', password: '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 6, firstName: 'Jerry', lastName: 'Fan', email: 'jerry@email.com', password: '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 7, firstName: 'Chinmay', lastName: 'Arvind', email: 'chinmay@email.com', password: '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', resetPasswordToken: null, resetPasswordExpires: null},
            { studentId: 8, firstName: 'Aayush', lastName: 'Chaudhary', email: 'aayush@email.com', password: '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', resetPasswordToken: null, resetPasswordExpires: null}
        ]);
    });

});

describe('DELETE /admin-api/student/:studentId/drop/:courseCode', () => {
    beforeAll(async () => {
        // Ensure test data is in place before running tests
        const studentId = 1; // Use a valid student ID from your database
        const courseCode = 'COSC 455'; // Use a valid course code from your database
        const enrollmentCheckQuery = `
            INSERT INTO "EnrolledIn" ("studentId", "courseId")
            VALUES ($1, (SELECT "courseId" FROM "Course" WHERE "courseCode" = $2))
            ON CONFLICT DO NOTHING
        `;
        await pool.query(enrollmentCheckQuery, [studentId, courseCode]);
    });

    test('Should drop a course for a student successfully', async () => {
        const studentId = 1; // Use a valid student ID from your database
        const courseCode = 'COSC 455'; // Use a valid course code from your database

        const response = await request(app)
            .delete(`/admin-api/student/${studentId}/drop/${courseCode}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Course dropped successfully' });

        // Verify the course was actually dropped
        const verifyDropQuery = `
            SELECT * FROM "EnrolledIn"
            WHERE "studentId" = $1 AND "courseId" = (
                SELECT "courseId" FROM "Course" WHERE "courseCode" = $2
            )
        `;
        const dropResult = await pool.query(verifyDropQuery, [studentId, courseCode]);
        expect(dropResult.rows.length).toBe(0);
    });

    test('Should return 404 if course not found or not enrolled', async () => {
        const studentId = 5; // Use a valid student ID from your database
        const courseCode = 'NON_EXISTENT_CODE'; // Use a non-existent course code to simulate error

        const response = await request(app)
            .delete(`/admin-api/student/${studentId}/drop/${courseCode}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Course not found or not enrolled' });
    });

    test('Should handle database errors gracefully', async () => {
        // Simulate a database error
        jest.spyOn(pool, 'query').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const studentId = 5;
        const courseCode = 'COSC 499';

        const response = await request(app)
            .delete(`/admin-api/student/${studentId}/drop/${courseCode}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });

        // Restore the original implementation of pool.query
        pool.query.mockRestore();
    });
});