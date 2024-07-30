const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/stu-api/login');
  }

// Fetch all students
router.get('/students', (req, res) => {
    pool.query('SELECT * FROM "Student"', (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results.rows);
    });
});

//Selects all information about a student and their enrolled courses
router.get('/student/:studentId', checkAuthenticated, async (req, res) => {
    const { studentId } = req.params;

    try {
        const studentQuery = `
            SELECT s."studentId", s."firstName", s."lastName", s."email", s."password"
            FROM "Student" s
            WHERE s."studentId" = $1
        `;
        const studentResult = await pool.query(studentQuery, [studentId]);
        const student = studentResult.rows[0];

        const courseQuery = `
            SELECT c."courseCode", c."courseId"
            FROM "Course" c
            JOIN "EnrolledIn" e ON c."courseId" = e."courseId"
            WHERE e."studentId" = $1
        `;
        const courseResult = await pool.query(courseQuery, [studentId]);
        const courses = courseResult.rows;

        res.json({
            ...student,
            courses
        });
    } catch (err) {
        console.error('Error fetching student details:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

//Drops a student from a course
router.delete('/student/:studentId/drop/:courseCode', checkAuthenticated, async (req, res) => {
    const { studentId, courseCode } = req.params;

    try {
        const dropQuery = `
            DELETE FROM "EnrolledIn"
            WHERE "studentId" = $1 AND "courseId" = (
                SELECT "courseId" FROM "Course" WHERE "courseCode" = $2
            )
        `;
        await pool.query(dropQuery, [studentId, courseCode]);
        res.status(200).json({ message: 'Course dropped successfully' });
    } catch (err) {
        console.error('Error dropping course:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Deletes a student from the database
// router.delete('/student/:studentId', checkAuthenticated, async (req, res) => {
//     const { studentId } = req.params;

//     try {
//         const deleteQuery = `
//             DELETE FROM "Student"
//             WHERE "studentId" = $1
//         `;
//         await pool.query(deleteQuery, [studentId]);
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting user:', err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// Soft deletes a student from the database
router.delete('/student/:studentId', checkAuthenticated, async (req, res) => {
    const { studentId } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Fetch the student to be deleted
        const selectQuery = 'SELECT * FROM "Student" WHERE "studentId" = $1';
        const result = await client.query(selectQuery, [studentId]);
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            console.log('Student not found, rolling back');
            return res.status(404).json({ error: 'Student not found' });
        }
        const student = result.rows[0];

        console.log('Student to be deleted:', student); // Debug log

        // Backup the student
        const insertBackupQuery = `
            INSERT INTO "BackupStudent" ("studentId", "firstName", "lastName", "email", "password", "resetPasswordToken", "resetPasswordExpires", "deleted_at")
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `;
        await client.query(insertBackupQuery, [
            student.studentId,
            student.firstName,
            student.lastName,
            student.email,
            student.password,
            student.resetPasswordToken,
            student.resetPasswordExpires
        ]);

        console.log('Student backed up successfully'); // Debug log

        // Backup related enrollments
        const enrollmentsResult = await client.query('SELECT * FROM "EnrolledIn" WHERE "studentId" = $1', [studentId]);
        for (const enrollment of enrollmentsResult.rows) {
            await client.query(`
                INSERT INTO "BackupEnrolledIn" ("studentId", "courseId", "studentGrade", "deleted_at")
                VALUES ($1, $2, $3, NOW())
            `, [enrollment.studentId, enrollment.courseId, enrollment.studentGrade]);
        }
        console.log('Related enrollments backed up successfully'); // Debug log

        // Backup related assignment submissions
        const submissionsResult = await client.query('SELECT * FROM "AssignmentSubmission" WHERE "studentId" = $1', [studentId]);
        for (const submission of submissionsResult.rows) {
            await client.query(`
                INSERT INTO "BackupAssignmentSubmission" ("assignmentSubmissionId", "studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded", "deleted_at")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            `, [
                submission.assignmentSubmissionId,
                submission.studentId,
                submission.courseId,
                submission.assignmentId,
                submission.submittedAt,
                submission.submissionFile,
                submission.isSubmitted,
                submission.updatedAt,
                submission.isGraded
            ]);
        }
        console.log('Related assignment submissions backed up successfully'); // Debug log

        // Backup related assignment grades
        for (const submission of submissionsResult.rows) {
            const gradesResult = await client.query('SELECT * FROM "AssignmentGrade" WHERE "assignmentSubmissionId" = $1', [submission.assignmentSubmissionId]);
            for (const grade of gradesResult.rows) {
                await client.query(`
                    INSERT INTO "BackupAssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded", "deleted_at")
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())
                `, [
                    grade.assignmentSubmissionId,
                    grade.assignmentId,
                    grade.maxObtainableGrade,
                    grade.AIassignedGrade,
                    grade.InstructorAssignedFinalGrade,
                    grade.isGraded
                ]);
            }
        }
        console.log('Related assignment grades backed up successfully'); // Debug log

        // Backup related feedback
        const feedbackResult = await client.query('SELECT * FROM "StudentFeedback" WHERE "studentId" = $1', [studentId]);
        for (const feedback of feedbackResult.rows) {
            await client.query(`
                INSERT INTO "BackupStudentFeedback" ("studentFeedbackId", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText", "deleted_at")
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
            `, [
                feedback.studentFeedbackId,
                feedback.studentId,
                feedback.assignmentId,
                feedback.courseId,
                feedback.AIFeedbackText,
                feedback.InstructorFeedbackText
            ]);
        }
        console.log('Related feedback backed up successfully'); // Debug log

        // Backup related feedback reports
        const feedbackReportResult = await client.query('SELECT * FROM "StudentFeedbackReport" WHERE "studentId" = $1', [studentId]);
        for (const feedbackReport of feedbackReportResult.rows) {
            await client.query(`
                INSERT INTO "BackupStudentFeedbackReport" ("studentFeedbackReportId", "studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText", "deleted_at")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            `, [
                feedbackReport.studentFeedbackReportId,
                feedbackReport.studentFeedbackReportText,
                feedbackReport.isResolved,
                feedbackReport.studentId,
                feedbackReport.assignmentId,
                feedbackReport.courseId,
                feedbackReport.AIFeedbackText,
                feedbackReport.InstructorFeedbackText
            ]);
        }
        console.log('Related feedback reports backed up successfully'); // Debug log

        // Delete the student from the main table
        const deleteQuery = 'DELETE FROM "Student" WHERE "studentId" = $1';
        await client.query(deleteQuery, [studentId]);

        console.log('Student deleted from main table'); // Debug log

        await client.query('COMMIT');
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        client.release();
    }
});

// Endpoint to fetch all students
router.get('/students', checkAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT "studentId", "firstName", "lastName"
            FROM "Student"
        `;
        const result = await pool.query(query);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch all deleted students
router.get('/deleted-students', checkAuthenticated, async (req, res) => {
    try {
        const result = await pool.query('SELECT "studentId", "firstName", "lastName", "email", "resetPasswordToken", "resetPasswordExpires", "deleted_at" FROM "BackupStudent"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching deleted students:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Restore student (soft delete restore)
router.post('/student/restore/:studentId', checkAuthenticated, async (req, res) => {
    const { studentId } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch the student from the backup table
        const selectQuery = 'SELECT * FROM "BackupStudent" WHERE "studentId" = $1';
        const result = await client.query(selectQuery, [studentId]);
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            console.log('Student not found in backup, rolling back');
            return res.status(404).json({ error: 'Student not found in backup' });
        }
        const student = result.rows[0];

        console.log('Student to be restored:', student); // Debug log

        // Restore the student to the main table
        const insertMainQuery = `
            INSERT INTO "Student" ("studentId", "firstName", "lastName", "email", "password", "resetPasswordToken", "resetPasswordExpires")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT DO NOTHING
        `;
        await client.query(insertMainQuery, [
            student.studentId,
            student.firstName,
            student.lastName,
            student.email,
            student.password,
            student.resetPasswordToken,
            student.resetPasswordExpires
        ]);

        console.log('Student restored to main table'); // Debug log

        // Restore related enrollments
        const backupEnrollmentsResult = await client.query('SELECT * FROM "BackupEnrolledIn" WHERE "studentId" = $1', [studentId]);
        for (const backupEnrollment of backupEnrollmentsResult.rows) {
            await client.query(`
                INSERT INTO "EnrolledIn" ("studentId", "courseId", "studentGrade")
                VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING
            `, [backupEnrollment.studentId, backupEnrollment.courseId, backupEnrollment.studentGrade]);
        }
        console.log('Related enrollments restored successfully'); // Debug log

        // Restore related assignment submissions
        const backupSubmissionsResult = await client.query('SELECT * FROM "BackupAssignmentSubmission" WHERE "studentId" = $1', [studentId]);
        for (const backupSubmission of backupSubmissionsResult.rows) {
            await client.query(`
                INSERT INTO "AssignmentSubmission" ("assignmentSubmissionId", "studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT DO NOTHING
            `, [
                backupSubmission.assignmentSubmissionId,
                backupSubmission.studentId,
                backupSubmission.courseId,
                backupSubmission.assignmentId,
                backupSubmission.submittedAt,
                backupSubmission.submissionFile,
                backupSubmission.isSubmitted,
                backupSubmission.updatedAt,
                backupSubmission.isGraded
            ]);
        }
        console.log('Related assignment submissions restored successfully'); // Debug log

        // Restore related assignment grades
        const backupGradesResult = await client.query('SELECT * FROM "BackupAssignmentGrade" WHERE "assignmentSubmissionId" IN (SELECT "assignmentSubmissionId" FROM "BackupAssignmentSubmission" WHERE "studentId" = $1)', [studentId]);
        for (const backupGrade of backupGradesResult.rows) {
            await client.query(`
                INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded")
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [
                backupGrade.assignmentSubmissionId,
                backupGrade.assignmentId,
                backupGrade.maxObtainableGrade,
                backupGrade.AIassignedGrade,
                backupGrade.InstructorAssignedFinalGrade,
                backupGrade.isGraded
            ]);
        }
        console.log('Related assignment grades restored successfully'); // Debug log

        // Restore related feedback
        const backupFeedbackResult = await client.query('SELECT * FROM "BackupStudentFeedback" WHERE "studentId" = $1', [studentId]);
        for (const backupFeedback of backupFeedbackResult.rows) {
            await client.query(`
                INSERT INTO "StudentFeedback" ("studentFeedbackId", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText")
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [
                backupFeedback.studentFeedbackId,
                backupFeedback.studentId,
                backupFeedback.assignmentId,
                backupFeedback.courseId,
                backupFeedback.AIFeedbackText,
                backupFeedback.InstructorFeedbackText
            ]);
        }
        console.log('Related feedback restored successfully'); // Debug log

        // Restore related feedback reports
        const backupFeedbackReportsResult = await client.query('SELECT * FROM "BackupStudentFeedbackReport" WHERE "studentId" = $1', [studentId]);
        for (const backupFeedbackReport of backupFeedbackReportsResult.rows) {
            await client.query(`
                INSERT INTO "StudentFeedbackReport" ("studentFeedbackReportId", "studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT DO NOTHING
            `, [
                backupFeedbackReport.studentFeedbackReportId,
                backupFeedbackReport.studentFeedbackReportText,
                backupFeedbackReport.isResolved,
                backupFeedbackReport.studentId,
                backupFeedbackReport.assignmentId,
                backupFeedbackReport.courseId,
                backupFeedbackReport.AIFeedbackText,
                backupFeedbackReport.InstructorFeedbackText
            ]);
        }
        console.log('Related feedback reports restored successfully'); // Debug log

        // Delete the backup entries for the restored student
        await client.query('DELETE FROM "BackupStudent" WHERE "studentId" = $1', [studentId]);
        await client.query('DELETE FROM "BackupEnrolledIn" WHERE "studentId" = $1', [studentId]);
        await client.query('DELETE FROM "BackupAssignmentSubmission" WHERE "studentId" = $1', [studentId]);
        await client.query('DELETE FROM "BackupAssignmentGrade" WHERE "assignmentSubmissionId" IN (SELECT "assignmentSubmissionId" FROM "BackupAssignmentSubmission" WHERE "studentId" = $1)', [studentId]);
        await client.query('DELETE FROM "BackupStudentFeedback" WHERE "studentId" = $1', [studentId]);
        await client.query('DELETE FROM "BackupStudentFeedbackReport" WHERE "studentId" = $1', [studentId]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Student restored successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error restoring student:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        client.release();
    }
});

// Clear all student backup tables
router.delete('/clear-backup/student', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM "BackupStudent"');
        await client.query('DELETE FROM "BackupEnrolledIn"');
        await client.query('DELETE FROM "BackupAssignmentSubmission"');
        await client.query('DELETE FROM "BackupAssignmentGrade"');
        await client.query('DELETE FROM "BackupStudentFeedback"');
        await client.query('DELETE FROM "BackupStudentFeedbackReport"');
        await client.query('COMMIT');
        res.status(200).json({ message: 'Backup tables cleared successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error clearing backup tables:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        client.release();
    }
});

module.exports = router;
