-- CREATE TABLE IF NOT EXISTS "Student" (
--     "studentId" SERIAL PRIMARY KEY,
--     "firstName" VARCHAR(50) NOT NULL,
--     "lastName" VARCHAR(50) NOT NULL,
--     "email" VARCHAR(100) UNIQUE NOT NULL,
--     "password" VARCHAR(255) NOT NULL,
--     "grade" DECIMAL(3, 2)
-- );

CREATE TABLE IF NOT EXISTS "Student" (
    "studentId" SERIAL PRIMARY KEY,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "email" VARCHAR(200) UNIQUE NOT NULL,
    "password" VARCHAR(300),
    "resetPasswordToken" VARCHAR(300),
    "resetPasswordExpires" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Instructor"(
    "instructorId" SERIAL NOT NULL PRIMARY KEY,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "email" VARCHAR(200),
    "password" VARCHAR(300),
    "department" VARCHAR(100), 
    "isTA" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "Course" (
    "courseId" SERIAL NOT NULL PRIMARY KEY,
    "courseName" VARCHAR(100),
    "courseCode" VARCHAR(100),
    "maxStudents" INT CHECK ("maxStudents" > 0),
    "courseDescription" VARCHAR(1000),
    "isApproved" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "Teaches"(
    "instructorId" INT NOT NULL,
    "courseId" INT NOT NULL,
    PRIMARY KEY ("instructorId", "courseId"),
    FOREIGN KEY ("instructorId") REFERENCES "Instructor"("instructorId")
    ON DELETE CASCADE,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId")
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "EnrolledIn"(
    "studentId" INT NOT NULL,
    "courseId" INT NOT NULL,
    "studentGrade" FLOAT,
    PRIMARY KEY ("studentId", "courseId"),
    FOREIGN KEY ("studentId") REFERENCES "Student"("studentId"),
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "SystemAdministrator"(
    "adminId" SERIAL NOT NULL PRIMARY KEY,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "email" VARCHAR(200) UNIQUE NOT NULL,
    "password" VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS "Assignment"(
    "assignmentId" SERIAL NOT NULL PRIMARY KEY,
    "courseId" INT,
    "dueDate" DATE,
    "assignmentKey" VARCHAR(500),
    "maxObtainableGrade" FLOAT,
    "assignmentDescription" VARCHAR(1000),
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") 
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "CourseNotification"(
    "senderId" SERIAL NOT NULL,
    "receiverId" INT NOT NULL,
    PRIMARY KEY ("senderId", "receiverId"),
    "courseId" INT,
    "notificationMessage" VARCHAR(1000),
    "isRead" BOOLEAN DEFAULT false,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "AssignmentSubmission"(
    "assignmentSubmissionId" SERIAL NOT NULL PRIMARY KEY,
    "studentId" INT NOT NULL,
    "courseId" INT NOT NULL,
    "assignmentId" INT NOT NULL,
    "submittedAt" DATE,
    "submissionFile" VARCHAR(500),
    "isSubmitted" BOOLEAN,
    "updatedAt" DATE,
    "isGraded" BOOLEAN DEFAULT false,
    FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE CASCADE,
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId") ON DELETE CASCADE,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "AssignmentGrade"(
    "assignmentSubmissionId" INT NOT NULL,
    "assignmentId" INT NOT NULL,
    PRIMARY KEY ("assignmentSubmissionId", "assignmentId"),
    "maxObtainableGrade" FLOAT,
    "AIassignedGrade" FLOAT,
    "InstructorAssignedFinalGrade" FLOAT,
    "isGraded" BOOLEAN DEFAULT false,
    FOREIGN KEY ("assignmentSubmissionId") REFERENCES "AssignmentSubmission"("assignmentSubmissionId") ON DELETE CASCADE,
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "StudentFeedback"(
    "studentFeedbackId" SERIAL NOT NULL PRIMARY KEY,
    "studentId" INT NOT NULL,
    "assignmentId" INT NOT NULL,
    "courseId" INT NOT NULL,
    "AIFeedbackText" VARCHAR(1000),
    "InstructorFeedbackText" VARCHAR(1000),
    FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE CASCADE,
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId") ON DELETE CASCADE,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "StudentFeedbackReport"(
    "studentFeedbackReportId" SERIAL NOT NULL PRIMARY KEY,
    "studentFeedbackReportText" VARCHAR(1000),
    "isResolved" BOOLEAN,
    "studentId" INT NOT NULL,
    "assignmentId" INT NOT NULL,
    "courseId" INT NOT NULL,
    "AIFeedbackText" VARCHAR(1000),
    "InstructorFeedbackText" VARCHAR(1000),
    FOREIGN KEY ("studentId") REFERENCES "Student"("studentId"),
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId"),
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId")
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "AssignmentRubric"(
    "assignmentRubricId" SERIAL NOT NULL PRIMARY KEY,
    "assignmentId" INT NOT NULL,
    "courseId" INT NOT NULL,
    "instructorId" INT NOT NULL,
    "criteria" VARCHAR(1000), /* Rubric upload as a file */
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId"),
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId")
    ON DELETE CASCADE
);

-- Insert dummy data for testing
-- Insert dummy data into Course table
INSERT INTO "Course" ("courseName", "courseCode", "courseDescription")
VALUES ('Introduction to Programming', 'CS101', 'An introductory course on programming'),
    ('Advanced CSS', 'COSC 455', 'A course on advanced CSS techniques'),
    ('Intro to Web Development', 'COSC 360', 'An introductory course on web development'),
    ('Intermediate JavaScript', 'COSC 388', 'A course on JavaScript programming'),
    ('Software Engineering Capstone', 'COSC 499', 'Final project for software engineering students')
ON CONFLICT DO NOTHING;

-- Insert dummy data into Assignment table
INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription")
VALUES 
    (1, '2022-01-15', 'assignment1', 100, 'Write a program to calculate the factorial of a number'),
    (2, '2022-02-10', 'assignment2', 100, 'Solve the following calculus problems'),
    (3, '2022-03-05', 'assignment3', 100, 'Perform experiments to verify Newton''s laws of motion')
ON CONFLICT DO NOTHING;

-- Insert dummy data into Student table
INSERT INTO "Student" ("firstName", "lastName", "email", "password")
VALUES 
    ('John', 'Doe', 'john.doe@example.com', 'password1'),
    ('Jane', 'Smith', 'jane.smith@example.com', 'password2'),
    ('Mike', 'Johnson', 'mike.johnson@example.com', 'password3'),
    ('Omar', 'Hemed', 'omar@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
    ('Colton', 'Palfrey', 'colton@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
    ('Jerry', 'Fan', 'jerry@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
    ('Chinmay', 'Arvind', 'chinmay@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
    ('Aayush', 'Chaudhary', 'aayush@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.')
ON CONFLICT DO NOTHING;

-- Insert dummy data into Instructor table
INSERT INTO "Instructor" ("instructorId", "firstName", "lastName", "email", "password", "department", "isTA")
VALUES 
    (1, 'Robert', 'Brown', 'robert.brown@example.com', 'password4', 'Computer Science', false),
    (2, 'Emily', 'Davis', 'emily.davis@example.com', 'password5', 'Mathematics', true),
    (3, 'Michael', 'Wilson', 'michael.wilson@example.com', 'password6', 'Physics', false),
    (4, 'Kevin', 'Zhang', 'kevin.zhang@example.com', 'password7', 'Computer Science', true),
    (5, 'Prof', 'Test', 'testprof@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', 'Computer Science', false),
    (6, 'TA', 'Test', 'testta@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.', 'Computer Science', true)
ON CONFLICT DO NOTHING;

-- Insert dummy data into EnrolledIn table
INSERT INTO "EnrolledIn" ("studentId", "courseId", "studentGrade")
VALUES 
    (1, 1, 90),
    (2, 1, 85),
    (3, 2, 92),
    (5, 5, 88),
    (5, 2, 90),
    (5, 4, 83),
    (6, 5, 88),
    (6, 2, 90),
    (7, 4, 83),
    (7, 5, 88),
    (4, 5, 90),
    (4, 4, 83)
ON CONFLICT DO NOTHING;

INSERT INTO "Teaches" ("instructorId", "courseId")
VALUES 
    (5, 5),
    (5, 1),
    (5, 4)
ON CONFLICT DO NOTHING;

-- Insert dummy data into SystemAdministrator table
INSERT INTO "SystemAdministrator" ("firstName", "lastName", "email", "password")
VALUES 
    ('Admin', 'Test', 'admin@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.')
ON CONFLICT DO NOTHING;

-- Insert dummy data into Assignment table
INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription")
VALUES 
    (1, '2022-01-15', 'assignment1', 100, 'Write a program to calculate the factorial of a number'),
    (2, '2022-02-10', 'assignment2', 100, 'Solve the following calculus problems'),
    (3, '2022-03-05', 'assignment3', 100, 'Perform experiments to verify Newton''s laws of motion')
ON CONFLICT DO NOTHING;

-- Insert dummy data into CourseNotification table
INSERT INTO "CourseNotification" ("senderId", "receiverId", "courseId", "notificationMessage", "isRead")
VALUES 
    (1, 2, 1, 'Reminder: Assignment 1 is due tomorrow', false),
    (2, 1, 2, 'New lecture notes uploaded for Calculus I', true),
    (3, 1, 3, 'Physics lab scheduled for next week', false)
ON CONFLICT DO NOTHING;

-- Insert dummy data into AssignmentSubmission table
INSERT INTO "AssignmentSubmission" ("studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded")
VALUES 
    (1, 5, 1, '2022-01-14', 'submission1.zip', true, '2022-01-14', true),
    (2, 5, 1, '2022-01-15', 'submission2.zip', true, '2022-01-15', true),
    (3, 5, 1, '2022-01-16', 'submission3.zip', true, '2022-01-16', true),
    (4, 5, 1, '2022-01-17', 'submission4.zip', true, '2022-01-17', false),
    (5, 5, 1, '2022-01-18', 'submission5.zip', true, '2022-01-18', true),
    (6, 5, 1, '2022-01-19', 'submission6.zip', true, '2022-01-19', false),
    (7, 5, 1, '2022-01-20', 'submission7.zip', true, '2022-01-20', false),
    (3, 5, 2, '2022-01-21', 'submission8.zip', true, '2022-01-21', false);

-- Insert dummy data into AssignmentGrade table
INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded")
VALUES 
    (1, 1, 100, 95, 0, true),
    (2, 1, 100, 90, 0, true),
    (3, 2, 100, 0, 0, false)
ON CONFLICT DO NOTHING;

-- Insert dummy data into StudentFeedback table
INSERT INTO "StudentFeedback" ("studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText")
VALUES 
    (1, 1, 1, 'Great job!', 'Good effort, but could be improved'),
    (2, 2, 1, 'Well done!', 'Excellent work'),
    (3, 3, 2, 'Needs improvement', 'Good attempt')
ON CONFLICT DO NOTHING;

-- Insert dummy data into StudentFeedbackReport table
INSERT INTO "StudentFeedbackReport" ("studentFeedbackReportText", "isResolved", "studentId", "assignmentId", "courseId", "AIFeedbackText", "InstructorFeedbackText")
VALUES 
    ('Reported issue regarding assignment grading', false, 1, 1, 1, 'N/A', 'N/A'),
    ('Reported missing lecture materials', true, 2, 1, 1, 'N/A', 'N/A'),
    ('Reported incorrect answer keys', false, 3, 2, 2, 'N/A', 'N/A')
ON CONFLICT DO NOTHING;

-- Insert dummy data into AssignmentRubric table
INSERT INTO "AssignmentRubric" ("assignmentId", "courseId", "instructorId", "criteria")
VALUES 
    (1, 1, 5, 'Correctness, Efficiency, Documentation'),
    (2, 2, 5, 'Problem Solving, Mathematical Reasoning'),
    (3, 3, 5, 'Experimental Design, Analysis')
ON CONFLICT DO NOTHING;
