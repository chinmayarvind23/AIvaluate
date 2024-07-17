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
    "isTA" BOOLEAN DEFAULT FALSE,
    "resetPasswordToken" VARCHAR(300),
    "resetPasswordExpires" TIMESTAMP
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
    FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE CASCADE,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "SystemAdministrator"(
    "adminId" SERIAL NOT NULL PRIMARY KEY,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "email" VARCHAR(200) UNIQUE NOT NULL,
    "password" VARCHAR(300),
    "resetPasswordToken" VARCHAR(300),
    "resetPasswordExpires" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Assignment"(
    "assignmentId" SERIAL NOT NULL PRIMARY KEY,
    "assignmentName" VARCHAR(100),
    "courseId" INT,
    "dueDate" DATE,
    "assignmentKey" VARCHAR(500),
    "maxObtainableGrade" FLOAT,
    "assignmentDescription" VARCHAR(1000),
    "isPublished" BOOLEAN DEFAULT false,
    "isGraded" BOOLEAN DEFAULT false,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS "AssignmentSubmission" (
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
    FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE CASCADE,
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId") ON DELETE CASCADE,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId")
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "AssignmentRubric"(
    "assignmentRubricId" SERIAL NOT NULL PRIMARY KEY,
    "rubricName" VARCHAR(150),
    "criteria" VARCHAR(1000),
    "courseId" INT,
    FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "useRubric"(
    "assignmentId" INT NOT NULL,
    "assignmentRubricId" INT NOT NULL,
    PRIMARY KEY ("assignmentId", "assignmentRubricId"),
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("assignmentId") ON DELETE CASCADE,
    FOREIGN KEY ("assignmentRubricId") REFERENCES "AssignmentRubric"("assignmentRubricId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Prompt"(
    "promptId" SERIAL NOT NULL PRIMARY KEY,
    "promptName" VARCHAR(100),
    "promptText" VARCHAR(2000),
    "instructorId" INT,
    "isSelected" BOOLEAN DEFAULT false,
    FOREIGN KEY ("instructorId") REFERENCES "Instructor"("instructorId") ON DELETE CASCADE
);

-- Insert dummy data for testing
-- Insert dummy data into Student table
-- INSERT INTO "Student" ("studentId", "firstName", "lastName", "email", "password")
-- VALUES (1, 'John', 'Doe', 'john.doe@example.com', 'password1'),
--        (2, 'Jane', 'Smith', 'jane.smith@example.com', 'password2'),
--        (3, 'Mike', 'Johnson', 'mike.johnson@example.com', 'password3'),
--        (4, 'Omar', 'Hemed', 'omar@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
--        (5, 'Colton', 'Palfrey', 'colton@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
--        (6, 'Jerry', 'Fan', 'jerry@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
--        (7, 'Chinmay', 'Arvind', 'chinmay@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.'),
--        (8, 'Aayush', 'Chaudhary', 'aayush@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.')
-- ON CONFLICT DO NOTHING;

INSERT INTO "Student" ("firstName", "lastName", "email", "password")
VALUES ('John', 'Doe', 'john.doe@example.com', 'password1'),
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

INSERT INTO "Course" ("courseId", "courseName", "courseCode", "courseDescription")
VALUES (1, 'Introduction to Programming', 'CS101', 'An introductory course on programming'),
    (2, 'Advanced CSS', 'COSC 455', 'A course on advanced CSS techniques'),
    (3, 'Intro to Web Developement', 'COSC 360', 'An introductory course on web development'),
    (4, 'Itermidiate JavaScript', 'COSC 388', 'A course on JavaScript programming'),
    (5, 'Software Engineering Capstone', 'COSC 499', 'Final project for software engineering students')
    ON CONFLICT DO NOTHING;

-- Insert dummy data into EnrolledIn table
INSERT INTO "EnrolledIn" ("studentId", "courseId", "studentGrade")
VALUES (2, 1, 85),
    (3, 2, 92),
    (5, 5, 88),
    (5, 2, 90),
    (5, 4, 83),
    (6, 5, 88),
    (6, 2, 90),
    (7, 4, 83),
    (7, 5, 88),
    (4, 5, 90),
    (4, 4, 83),
    (1, 5, 60),
    (2, 5, 78),
    (3, 5, 81)
ON CONFLICT DO NOTHING;

INSERT INTO "Teaches" ("instructorId", "courseId")
VALUES (5, 5),
       (5, 1),
       (5, 4)
ON CONFLICT DO NOTHING;

-- Insert dummy data into SystemAdministrator table
INSERT INTO "SystemAdministrator" ("firstName", "lastName", "email", "password")
VALUES 
    ('Admin', 'Test', 'admin@email.com', '$2a$10$/4wPUiyTEj/pMZn3P1Zvp.neJO/FQYknhz0D0xpaPRoH.jHKDFgW.')
ON CONFLICT DO NOTHING;

INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentName", "assignmentKey", "maxObtainableGrade", "assignmentDescription")
VALUES (3, '2024-06-30', 'Assignment 1', 'Assignment-1-key.zip',  10, 'Design a login page with html and css'),
       (3, '2024-07-05', 'Assignment 2', 'Assignment-2-key.zip',  25, 'Design an account page with html and css'),
       (3, '2024-07-15', 'Assignment 3', 'Assignment-3-key.zip',  12, 'Design a home page with html and css'),
       (4, '2024-06-12', 'Lab 1', 'Lab-1-key.zip',  12, 'Create a login page with JavaScript validation'),
       (4, '2024-07-11', 'Lab 2', 'Lab-2-key.zip',  12, 'Create a sign up page with JavaScript validation'),
       (4, '2024-07-15', 'Lab 3', 'Lab-3-key.zip',  12, 'Create a dashboard page with JavaScript variables and functions'),
       (2, '2024-06-25', 'Assignment 1', 'Assignment-1-key.zip',  20, 'Design a interactive page with html and css'),
       (2, '2024-07-01', 'Lab 1', 'Lab-1-key.zip',  35, 'Design a menu that pops down from the nav bar when the html loads'),
       (2, '2024-07-06', 'Assignment 2', 'Assignment-2-key.zip',  65, 'Make a moving background with html and css'),
       (5, '2024-06-05', 'Assignment 1', 'Assignment-1-key.zip',  100, 'Create design plan document with html'),
       (5, '2024-06-15', 'Assignment 2', 'Assignment-2-key.zip',  88, 'Create project plan document with html'),
       (5, '2024-07-09', 'Assignment 3', 'Assignment-3-key.zip',  50, 'Design you sign in page with html, css, and javascript'),
       (1, '2024-06-28', 'Assignment 1', 'Assignment-1-key.zip',  5, 'Create a html page that says hello world in a heading tag'),
       (1, '2024-07-03', 'Assignment 2', 'Assignment-2-key.zip',  10, 'Create a html page that has a list of your favorite things in a list tag'),
       (1, '2024-07-09', 'Lab 1', 'Lab-1-key.zip',  10, 'Create a html page that has a table of your favorite things in a table tag')
ON CONFLICT DO NOTHING;

-- Insert dummy data into CourseNotification table
INSERT INTO "CourseNotification" ("senderId", "receiverId", "courseId", "notificationMessage", "isRead")
VALUES 
    (1, 2, 1, 'Reminder: Assignment 1 is due tomorrow', false),
    (2, 1, 2, 'New lecture notes uploaded for Calculus I', true),
    (3, 1, 3, 'Physics lab scheduled for next week', false)
ON CONFLICT DO NOTHING;

-- Creating Tables (No changes needed here)

-- Insert dummy data into AssignmentSubmission table with conflict handling
INSERT INTO "AssignmentSubmission" ("studentId", "courseId", "assignmentId", "submittedAt", "submissionFile", "isSubmitted", "updatedAt", "isGraded")
VALUES (1, 1, 1, '2022-01-14', 'submission1.zip', true, '2022-01-14', true),
       (2, 2, 1, '2022-01-15', 'submission2.zip', true, '2022-01-15', true),
       (3, 3, 2, '2022-02-10', 'submission3.zip', true, '2022-02-10', false),
       (5, 5, 10, '2024-06-04', 'assignment-1-files', true, '2024-06-04', true),
       (5, 5, 11, '2024-06-14', 'assignment-2-files', true, '2024-06-14', true),
       (5, 5, 12, '2024-07-08', 'assignment-3-files', true, '2024-07-08', false),
       (6, 5, 10, '2024-06-04', 'assignment-1-files', true, '2024-06-04', true),
       (6, 5, 11, '2024-06-14', 'assignment-2-files', true, '2024-06-14', true),
       (6, 5, 12, '2024-07-08', 'assignment-3-files', true, '2024-07-08', false),
       (7, 5, 10, '2024-06-04', 'assignment-1-files', true, '2024-06-04', true),
       (7, 5, 11, '2024-06-14', 'assignment-2-files', true, '2024-06-14', true),
       (7, 5, 12, '2024-07-08', 'assignment-3-files', true, '2024-07-08', false),
       (4, 5, 10, '2024-06-04', 'assignment-1-files', true, '2024-06-04', true),
       (4, 5, 11, '2024-06-14', 'assignment-2-files', true, '2024-06-14', true),
       (4, 5, 12, '2024-07-08', 'assignment-3-files', true, '2024-07-08', false),
       (4, 4, 5, '2024-07-11', 'lab-2-files', true, '2024-07-11', false),
       (4, 4, 6, '2024-07-15', 'lab-3-files', true, '2024-07-15', false),
       (4, 4, 4, '2024-06-12', 'lab-1-files', true, '2024-06-12', true),
       (5, 2, 7, '2024-06-25', 'assignment-1-files', true, '2024-06-25', true),
       (5, 2, 8, '2024-07-01', 'lab-1-files', true, '2024-07-01', false),
       (5, 2, 9, '2024-07-06', 'assignment-2-files', true, '2024-07-06', false),
       (6, 2, 7, '2024-06-25', 'assignment-1-files', true, '2024-06-25', true),
       (6, 2, 8, '2024-07-01', 'lab-1-files', true, '2024-07-01', false),
       (6, 2, 9, '2024-07-06', 'assignment-2-files', true, '2024-07-06', false),
       (7, 4, 4, '2024-06-12', 'lab-1-files', true, '2024-06-12', true),
       (7, 4, 5, '2024-07-11', 'lab-2-files', true, '2024-07-11', false),
       (7, 4, 6, '2024-07-15', 'lab-3-files', true, '2024-07-15', false),
       (8, 4, 4, '2024-06-12', 'lab-1-files', true, '2024-06-12', true),
       (8, 4, 5, '2024-07-11', 'lab-2-files', true, '2024-07-11', false),
       (8, 4, 6, '2024-07-15', 'lab-3-files', true, '2024-07-15', false);

-- Insert dummy data into AssignmentGrade table with conflict handling
INSERT INTO "AssignmentGrade" ("assignmentSubmissionId", "assignmentId", "maxObtainableGrade", "AIassignedGrade", "InstructorAssignedFinalGrade", "isGraded")
VALUES (1, 1, 10, 8, 8, true),
       (2, 1, 10, 9, 9, true),
       (3, 2, 25, 0, 0, false),
       (4, 10, 100, 67, 67, true),
       (5, 11, 88, 85, 85, true),
       (6, 12, 50, 0, 0, false),
       (7, 10, 100, 73, 73, true),
       (8, 11, 35, 23, 23, true),
       (9, 12, 50, 0, 0, false),
       (10, 10, 100, 91, 91, true),
       (11, 11, 35, 85, 85, true),
       (12, 12, 50, 0, 0, false),
       (13, 10, 100, 90, 90, true),
       (14, 11, 35, 33, 33, true),
       (15, 12, 50, 0, 0, false),
       (16, 5, 12, 12, 12, true),
       (17, 6, 12, 11, 11, true),
       (18, 4, 12, 0, 0, false),
       (19, 7, 20, 17, 17, true),
       (20, 8, 35, 34, 34, true),
       (21, 9, 65, 0, 0, false),
       (22, 7, 20, 18, 18, true),
       (23, 8, 35, 30, 30, true),
       (24, 9, 65, 0, 0, false),
       (25, 4, 12, 9, 9, true),
       (26, 5, 12, 11, 11, true),
       (27, 6, 12, 0, 0, false),
       (28, 4, 12, 12, 12, true),
       (29, 5, 12, 12, 12, true),
       (30, 6, 12, 0, 0, false)
ON CONFLICT ("assignmentSubmissionId", "assignmentId") DO NOTHING;

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
INSERT INTO "AssignmentRubric" ("criteria", "rubricName", "courseId")
VALUES 
    ('Correctness, Efficiency, Documentation', 'Rubric 1', '1'),
    ('Problem Solving, Mathematical Reasoning', 'Rubric 2', '2'),
    ('Experimental Design, Analysis', 'Rubric 3', '3')
ON CONFLICT DO NOTHING;

-- Insert dummy data into Prompt table
INSERT INTO "Prompt" ("promptName", "promptText", "instructorId")
VALUES 
    ('Prompt 1', 'Prompt 1 description', '5'),
    ('Prompt 2', 'Prompt 2 description', '5'),
    ('Prompt 3', 'Prompt 3 description', '5')

ON CONFLICT DO NOTHING;