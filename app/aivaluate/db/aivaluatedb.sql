CREATE TABLE Student (
    studentId INT NOT NULL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(200),
    userPassword VARCHAR(300)
);

CREATE TABLE Instructor(
    instructorId INT NOT NULL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(200),
    userPassword VARCHAR(300),
    department VARCHAR(100),
    hasFullAccess BOOLEAN
);

CREATE TABLE Course (
    courseId INT NOT NULL PRIMARY KEY,
    courseName VARCHAR(100),
    courseCode VARCHAR(100),
    courseDescription VARCHAR(1000),
    instructorId INT,
    FOREIGN KEY (instructorId) REFERENCES Instructor(instructorId)
);

CREATE TABLE EnrolledIn(
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    studentGrade FLOAT,
    PRIMARY KEY (studentId, courseId),
    FOREIGN KEY (studentId) REFERENCES Student(studentId),
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);
)

CREATE TABLE SystemAdministrator(
    adminId INT NOT NULL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(200),
    userPassword VARCHAR(300)
);

CREATE TABLE Assignment(
    assignmentId INT NOT NULL PRIMARY KEY,
    courseId INT,
    dueDate DATE,
    assignmentKey VARCHAR(500),
    maxObtainableGrade FLOAT,
    assignmentDescription VARCHAR(1000),
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);

CREATE TABLE CourseNotification(
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    PRIMARY KEY (senderId, receiverId),
    courseId INT,
    message VARCHAR(1000),
    isRead BOOLEAN,
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);

CREATE TABLE AssignmentSubmission(
    assignmentSubmissionId INT NOT NULL PRIMARY KEY,
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    assignmentId INT NOT NULL,
    submittedAt DATE,
    submissionFile VARCHAR(500),
    isSubmitted BOOLEAN,
    updatedAt DATE,
    isGraded BOOLEAN,
    FOREIGN KEY (studentId) REFERENCES Student(studentId),
    FOREIGN KEY (assignmentId) REFERENCES Assignment(assignmentId),
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);

CREATE TABLE AssignmentGrade(
    assignmentSubmissionId INT NOT NULL,
    assignmentId INT NOT NULL,
    PRIMARY KEY (assignmentSubmissionId, assignmentId),
    maxObtainableGrade FLOAT,
    AIassignedGrade FLOAT,
    InstructorAssignedFinalGrade FLOAT,
    isGraded BOOLEAN,
    FOREIGN KEY (isGraded) REFERENCES AssignmentSubmission(isGraded),
    FOREIGN KEY maxObtainableGrade REFERENCES Assignment(maxObtainableGrade),
    FOREIGN KEY (assignmentSubmissionId) REFERENCES AssignmentSubmission(assignmentSubmissionId)
);

CREATE TABLE StudentFeedback(
    studentFeedbackId INT NOT NULL PRIMARY KEY,
    studentId INT NOT NULL,
    assignmentId INT NOT NULL,
    courseId INT NOT NULL,
    AIFeedbackText VARCHAR(1000),
    InstructorFeedbackText VARCHAR(1000),
    FOREIGN KEY (studentId) REFERENCES Student(studentId),
    FOREIGN KEY (assignmentId) REFERENCES Assignment(assignmentId),
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);

CREATE TABLE StudentFeedbackReport(
    studentFeedbackReportId INT NOT NULL PRIMARY KEY,
    studentFeedbackReportText VARCHAR(1000),
    isResolved BOOLEAN,
    studentId INT NOT NULL,
    assignmentId INT NOT NULL,
    courseId INT NOT NULL,
    AIFeedbackText VARCHAR(1000),
    InstructorFeedbackText VARCHAR(1000),
    FOREIGN KEY (studentId) REFERENCES Student(studentId),
    FOREIGN KEY (assignmentId) REFERENCES Assignment(assignmentId),
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);

CREATE TABLE AssignmentRubric(
    assignmentRubricId INT NOT NULL PRIMARY KEY,
    assignmentId INT NOT NULL,
    courseId INT NOT NULL,
    criteria VARCHAR(1000), /* Rubric upload as a file */
    FOREIGN KEY (assignmentId) REFERENCES Assignment(assignmentId),
    FOREIGN KEY (courseId) REFERENCES Course(courseId)
);

