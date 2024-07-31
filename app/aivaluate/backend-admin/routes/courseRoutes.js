const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig'); 

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin-api/login');
}

// Create a course
router.post('/courses', async (req, res) => {
    const { courseName, courseCode, maxStudents } = req.body;
    console.log(req.body);

    try {
        const result = await pool.query(
            'INSERT INTO "Course" ("courseName", "courseCode", "maxStudents") VALUES ($1, $2, $3) RETURNING "courseId"',
            [courseName, courseCode, maxStudents]
        );
        res.status(201).send({ courseId: result.rows[0].courseId, message: 'Course created successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send({ message: 'Error creating course' });
    }
});

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Course"');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

// Get all archived courses
router.get('/courses/archived', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Course" WHERE "isArchived" = TRUE');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

// Get all active courses
router.get('/courses/active', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM "Course" WHERE "isArchived" = FALSE');
        res.status(200).send(courses.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ message: 'Error fetching courses' });
    }
});

router.get('/enrolled-courses', checkAuthenticated, (req, res) => {
    const instructorId = req.user.instructorId;
    console.log('instructor ID:', instructorId);

    pool.query(
        `SELECT "Course"."courseId", "Course"."courseCode", "Course"."courseName" 
         FROM "Teaches" 
         JOIN "Course" ON "Teaches"."courseId" = "Course"."courseId" 
         WHERE "Teaches"."instructorId" = $1`,
        [instructorId],
        (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('Courses:', results.rows);
            res.json(results.rows);
        }
    );
});

router.get('/courses/:courseId', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    try {
        const courseQuery = 'SELECT * FROM "Course" WHERE "courseId" = $1';
        const courseResult = await pool.query(courseQuery, [courseId]);

        if (courseResult.rowCount === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const course = courseResult.rows[0];

        // Fetch the primary instructor for the course
        const instructorQuery = `
            SELECT "Instructor"."instructorId", "Instructor"."firstName", "Instructor"."lastName"
            FROM "Instructor"
            JOIN "Teaches" ON "Instructor"."instructorId" = "Teaches"."instructorId"
            WHERE "Teaches"."courseId" = $1 AND "Instructor"."isTA" = FALSE
        `;
        const instructorResult = await pool.query(instructorQuery, [courseId]);

        // Fetch all TAs for the course
        const tasQuery = `
            SELECT "Instructor"."instructorId", "Instructor"."firstName", "Instructor"."lastName"
            FROM "Instructor"
            JOIN "Teaches" ON "Instructor"."instructorId" = "Teaches"."instructorId"
            WHERE "Teaches"."courseId" = $1 AND "Instructor"."isTA" = TRUE
        `;
        const tasResult = await pool.query(tasQuery, [courseId]);

        const instructor = instructorResult.rows[0] || null;
        const tas = tasResult.rows;

        res.status(200).json({ ...course, instructor, tas });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
});

// Update a course
router.put('/courses/:id', async (req, res) => {
    const courseId = req.params.id;
    const { courseName, courseCode, maxStudents } = req.body;

    try {
        const result = await pool.query(
            'UPDATE "Course" SET "courseName" = $1, "courseCode" = $2, "maxStudents" = $3 WHERE "courseId" = $4',
            [courseName, courseCode, maxStudents, courseId]
        );

        if (result.rowCount > 0) {
            res.status(200).send({ message: 'Course updated successfully' });
        } else {
            res.status(404).send({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send({ message: 'Error updating course' });
    }
});

// Create a course
router.post('/courses', async (req, res) => {
    const { courseName, courseCode, maxStudents } = req.body;

    console.log(req.body);

    try {
        const result = await pool.query(
            'INSERT INTO "Course" ("courseName", "courseCode", "maxStudents") VALUES ($1, $2, $3) RETURNING "courseId"',
            [courseName, courseCode, maxStudents]
        );
        res.status(201).send({ courseId: result.rows[0].courseId, message: 'Course created successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send({ message: 'Error creating course' });
    }
});



// Fetch all submissions for a course
router.get('/courses/:courseId/submissions', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    if (!courseId) {
        return res.status(400).json({ message: 'Invalid course ID' });
    }

    try {
        const query = `
            SELECT 
                "AssignmentSubmission"."assignmentSubmissionId",
                "AssignmentSubmission"."studentId",
                "Student"."firstName",
                "Student"."lastName",
                "Assignment"."assignmentKey",
                "Assignment"."assignmentId",
                "AssignmentSubmission"."isGraded",
                "AssignmentSubmission"."submissionFile"
            FROM "AssignmentSubmission"
            JOIN "Assignment" ON "AssignmentSubmission"."assignmentId" = "Assignment"."assignmentId"
            JOIN "Student" ON "AssignmentSubmission"."studentId" = "Student"."studentId"
            WHERE "AssignmentSubmission"."courseId" = $1
        `;
        const result = await pool.query(query, [courseId]);
        console.log(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No submissions found for this course' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Error fetching submissions' });
    }
});

// Fetch course details for an instructor
router.get('/instructors/:instructorId/courses', async (req, res) => {
    const instructorId = parseInt(req.params.instructorId, 10);

    try {
        const result = await pool.query(
            `SELECT "Course"."courseId", "Course"."courseName", "Course"."courseCode"
             FROM "Teaches"
             JOIN "Course" ON "Teaches"."courseId" = "Course"."courseId"
             WHERE "Teaches"."instructorId" = $1`,
            [instructorId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

// Archive a course
router.put('/courses/:courseId/archive', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    try {
        const result = await pool.query('UPDATE "Course" SET "isArchived" = TRUE WHERE "courseId" = $1', [courseId]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Course archived successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error archiving course:', error);
        res.status(500).json({ message: 'Error archiving course' });
    }
});

// Unarchive a course
router.put('/courses/:courseId/unarchive', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    try {
        const result = await pool.query('UPDATE "Course" SET "isArchived" = FALSE WHERE "courseId" = $1', [courseId]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Course unarchived successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error unarchiving course:', error);
        res.status(500).json({ message: 'Error unarchiving course' });
    }
});

// Determine if a course is archived
router.get('/courses/:courseId/is-archived', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);

    try {
        const result = await pool.query('SELECT "isArchived" FROM "Course" WHERE "courseId" = $1', [courseId]);

        if (result.rowCount > 0) {
            res.status(200).json({ isArchived: result.rows[0].isArchived });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
});

// Assign a professor to a course
router.post('/courses/:courseId/instructors', async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);
    const { instructorId } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO "Teaches" ("instructorId", "courseId") VALUES ($1, $2)',
            [instructorId, courseId]
        );
        res.status(201).json({ message: 'Professor assigned to course successfully' });
    } catch (error) {
        console.error('Error assigning professor to course:', error);
        res.status(500).json({ message: 'Error assigning professor to course' });
    }
});

// Soft delete a course and backup dependent data
router.delete('/courses/:id', async (req, res) => {
    const courseId = req.params.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Backup dependent data
        await client.query(`
            INSERT INTO "BackupEnrolledIn" ("studentId", "courseId", "studentGrade", "deleted_at")
            SELECT "studentId", "courseId", "studentGrade", NOW()
            FROM "EnrolledIn"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupTeaches" ("instructorId", "courseId", "deleted_at")
            SELECT "instructorId", "courseId", NOW()
            FROM "Teaches"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupAssignment" ("assignmentId", "assignmentName", "courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription", "isPublished", "isGraded", "deleted_at")
            SELECT "assignmentId", "assignmentName", "courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription", "isPublished", "isGraded", NOW()
            FROM "Assignment"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupAssignmentSubmission" ("assignmentSubmissionId", "studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded", "deleted_at")
            SELECT "assignmentSubmissionId", "studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded", NOW()
            FROM "AssignmentSubmission"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupAssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded", "deleted_at")
            SELECT "assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded", NOW()
            FROM "AssignmentGrade"
            WHERE "assignmentSubmissionId" IN (
                SELECT "assignmentSubmissionId" FROM "AssignmentSubmission" WHERE "courseId" = $1
            )
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupCourseNotification" ("senderId", "receiverId", "courseId", "notificationMessage", "isRead", "deleted_at")
            SELECT "senderId", "receiverId", "courseId", "notificationMessage", "isRead", NOW()
            FROM "CourseNotification"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupStudentFeedback" ("studentFeedbackId", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText", "deleted_at")
            SELECT "studentFeedbackId", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText", NOW()
            FROM "StudentFeedback"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupStudentFeedbackReport" ("studentFeedbackReportId", "studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText", "deleted_at")
            SELECT "studentFeedbackReportId", "studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText", NOW()
            FROM "StudentFeedbackReport"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupAssignmentRubric" ("assignmentRubricId", "rubricName", "criteria", "courseId", "deleted_at")
            SELECT "assignmentRubricId", "rubricName", "criteria", "courseId", NOW()
            FROM "AssignmentRubric"
            WHERE "courseId" = $1
        `, [courseId]);

        await client.query(`
            INSERT INTO "BackupUseRubric" ("assignmentId", "assignmentRubricId", "deleted_at")
            SELECT "assignmentId", "assignmentRubricId", NOW()
            FROM "useRubric"
            WHERE "assignmentId" IN (
                SELECT "assignmentId" FROM "Assignment" WHERE "courseId" = $1
            )
        `, [courseId]);

        // Backup course data
        await client.query(`
            INSERT INTO "BackupCourse" ("courseId", "courseName", "courseCode", "maxStudents", "courseDescription", "isArchived", "deleted_at")
            SELECT "courseId", "courseName", "courseCode", "maxStudents", "courseDescription", "isArchived", NOW()
            FROM "Course"
            WHERE "courseId" = $1
            RETURNING "courseId"
        `, [courseId]);

        // Delete dependent data
        await client.query('DELETE FROM "EnrolledIn" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "Teaches" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "AssignmentGrade" WHERE "assignmentSubmissionId" IN (SELECT "assignmentSubmissionId" FROM "AssignmentSubmission" WHERE "courseId" = $1)', [courseId]);
        await client.query('DELETE FROM "AssignmentSubmission" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "Assignment" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "CourseNotification" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "StudentFeedback" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "StudentFeedbackReport" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "AssignmentRubric" WHERE "courseId" = $1', [courseId]);
        await client.query('DELETE FROM "useRubric" WHERE "assignmentId" IN (SELECT "assignmentId" FROM "Assignment" WHERE "courseId" = $1)', [courseId]);

        // Delete course data
        await client.query('DELETE FROM "Course" WHERE "courseId" = $1', [courseId]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Course and dependencies deleted and backed up successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Error deleting course' });
    } finally {
        client.release();
    }
});

// Restore a course and its dependencies from the backup table
router.post('/course/restore/:id', async (req, res) => {
    const courseId = req.params.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Restore course data
        const courseResult = await client.query(`
            INSERT INTO "Course" ("courseId", "courseName", "courseCode", "maxStudents", "courseDescription", "isArchived")
            SELECT "courseId", "courseName", "courseCode", "maxStudents", "courseDescription", "isArchived"
            FROM "BackupCourse"
            WHERE "courseId" = $1
            RETURNING "courseId"
        `, [courseId]);

        if (courseResult.rowCount > 0) {
            // Restore dependent data
            await client.query(`
                INSERT INTO "EnrolledIn" ("studentId", "courseId", "studentGrade")
                SELECT "studentId", "courseId", "studentGrade"
                FROM "BackupEnrolledIn"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "Teaches" ("instructorId", "courseId")
                SELECT "instructorId", "courseId"
                FROM "BackupTeaches"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "Assignment" ("assignmentId", "assignmentName", "courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription", "isPublished", "isGraded")
                SELECT "assignmentId", "assignmentName", "courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription", "isPublished", "isGraded"
                FROM "BackupAssignment"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "AssignmentSubmission" ("assignmentSubmissionId", "studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded")
                SELECT "assignmentSubmissionId", "studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded"
                FROM "BackupAssignmentSubmission"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded")
                SELECT "assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded"
                FROM "BackupAssignmentGrade"
                WHERE "assignmentSubmissionId" IN (
                    SELECT "assignmentSubmissionId" FROM "AssignmentSubmission" WHERE "courseId" = $1
                )
            `, [courseId]);

            await client.query(`
                INSERT INTO "CourseNotification" ("senderId", "receiverId", "courseId", "notificationMessage", "isRead")
                SELECT "senderId", "receiverId", "courseId", "notificationMessage", "isRead"
                FROM "BackupCourseNotification"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "StudentFeedback" ("studentFeedbackId", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText")
                SELECT "studentFeedbackId", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText"
                FROM "BackupStudentFeedback"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "StudentFeedbackReport" ("studentFeedbackReportId", "studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText")
                SELECT "studentFeedbackReportId", "studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText"
                FROM "BackupStudentFeedbackReport"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "AssignmentRubric" ("assignmentRubricId", "rubricName", "criteria", "courseId")
                SELECT "assignmentRubricId", "rubricName", "criteria", "courseId"
                FROM "BackupAssignmentRubric"
                WHERE "courseId" = $1
            `, [courseId]);

            await client.query(`
                INSERT INTO "useRubric" ("assignmentId", "assignmentRubricId")
                SELECT "assignmentId", "assignmentRubricId"
                FROM "BackupUseRubric"
                WHERE "assignmentId" IN (
                    SELECT "assignmentId" FROM "Assignment" WHERE "courseId" = $1
                )
            `, [courseId]);

            // Delete data from backup tables
            await client.query('DELETE FROM "BackupEnrolledIn" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupTeaches" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupAssignment" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupAssignmentSubmission" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupAssignmentGrade" WHERE "assignmentSubmissionId" IN (SELECT "assignmentSubmissionId" FROM "AssignmentSubmission" WHERE "courseId" = $1)', [courseId]);
            await client.query('DELETE FROM "BackupCourseNotification" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupStudentFeedback" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupStudentFeedbackReport" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupAssignmentRubric" WHERE "courseId" = $1', [courseId]);
            await client.query('DELETE FROM "BackupUseRubric" WHERE "assignmentId" IN (SELECT "assignmentId" FROM "Assignment" WHERE "courseId" = $1)', [courseId]);
            await client.query('DELETE FROM "BackupCourse" WHERE "courseId" = $1', [courseId]);

            await client.query('COMMIT');
            res.status(200).json({ message: 'Course and dependencies restored successfully' });
        } else {
            await client.query('ROLLBACK');
            res.status(404).json({ message: 'Course not found in backup' });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error restoring course:', error);
        res.status(500).json({ message: 'Error restoring course' });
    } finally {
        client.release();
    }
});

// Get all deleted courses
router.get('/deleted-courses', async (req, res) => {
    try {
        const deletedCourses = await pool.query('SELECT * FROM "BackupCourse"');
        res.status(200).send(deletedCourses.rows);
    } catch (error) {
        console.error('Error fetching deleted courses:', error);
        res.status(500).send({ message: 'Error fetching deleted courses' });
    }
});

// Clear all backup tables
router.delete('/clear-backups', checkAuthenticated, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const backupTables = [
            "BackupStudent",
            "BackupInstructor",
            "BackupCourse",
            "BackupEnrolledIn",
            "BackupTeaches",
            "BackupAssignment",
            "BackupAssignmentSubmission",
            "BackupAssignmentGrade",
            "BackupStudentFeedback",
            "BackupStudentFeedbackReport",
            "BackupAssignmentRubric",
            "BackupUseRubric",
            "BackupCourseNotification",
            "BackupPrompt"
        ];

        for (const table of backupTables) {
            await client.query(`DELETE FROM "${table}"`);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'All backup tables cleared successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error clearing backup tables:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        client.release();
    }
});

module.exports = router;