// tests/courseRoutes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mocking the database pool
const pool = {
  query: jest.fn()
};

// Mocking the authentication middleware
const checkAuthenticated = (req, res, next) => {
  req.user = { studentId: '1' }; // Mocked user
  next();
};

const app = express();
app.use(bodyParser.json());

// Define the course routes
const router = express.Router();
router.use((req, res, next) => {
  req.isAuthenticated = () => true; // Mock authentication
  next();
});

router.post('/courses', async (req, res) => {
  const { courseName, courseCode, maxStudents } = req.body;

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

router.get('/courses', async (req, res) => {
  try {
    const courses = await pool.query('SELECT * FROM "Course"');
    res.status(200).send(courses.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send({ message: 'Error fetching courses' });
  }
});

router.get('/courses/:id', async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await pool.query('SELECT * FROM "Course" WHERE "courseId" = $1', [courseId]);

    if (course.rowCount > 0) {
      res.status(200).send(course.rows[0]);
    } else {
      res.status(404).send({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send({ message: 'Error fetching course' });
  }
});

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

router.delete('/courses/:id', async (req, res) => {
  const courseId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM "Course" WHERE "courseId" = $1', [courseId]);

    if (result.rowCount > 0) {
      res.status(200).send({ message: 'Course deleted successfully' });
    } else {
      res.status(404).send({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send({ message: 'Error deleting course' });
  }
});

router.post('/enroll-course', checkAuthenticated, (req, res) => {
  const studentId = req.user.studentId; // Access the studentId from the session
  const courseId = req.body.courseId;

  pool.query(
    `INSERT INTO "EnrolledIn" ("studentId", "courseId") VALUES ($1, $2)`,
    [studentId, courseId],
    (err, results) => {
      if (err) {
        console.error('Error enrolling student:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Successfully enrolled in the course' });
    }
  );
});

router.get('/enrolled-courses', checkAuthenticated, (req, res) => {
  const studentId = req.user.studentId; // Access the studentId from the session
  console.log('Student ID:', studentId); // Log student ID to verify

  pool.query(
    `SELECT "Course"."courseId", "Course"."courseCode", "Course"."courseName"
         FROM "EnrolledIn" 
         JOIN "Course" ON "EnrolledIn"."courseId" = "Course"."courseId" 
         WHERE "EnrolledIn"."studentId" = $1`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Courses:', results.rows); // Log query results to verify
      res.json(results.rows);
    }
  );
});

router.get('/not-enrolled-courses', checkAuthenticated, (req, res) => {
  const studentId = req.user.studentId; // Access the studentId from the session

  pool.query(
    `SELECT "Course"."courseId", "Course"."courseCode", "Course"."courseName", "Course"."maxStudents" 
         FROM "Course"
         LEFT JOIN "EnrolledIn" 
         ON "Course"."courseId" = "EnrolledIn"."courseId" 
         AND "EnrolledIn"."studentId" = $1
         WHERE "EnrolledIn"."studentId" IS NULL`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results.rows);
    }
  );
});

app.use(router);

describe('Course Routes', () => {
  describe('POST /courses', () => {
    it('should create a new course', async () => {
      pool.query.mockImplementation(() => Promise.resolve({ rows: [{ courseId: 1 }] }));

      const response = await request(app)
        .post('/courses')
        .send({
          courseName: 'Test Course',
          courseCode: 'TC101',
          maxStudents: 30
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        courseId: 1,
        message: 'Course created successfully'
      });
    });

    it('should return an error when creating a course', async () => {
      pool.query.mockImplementation(() => Promise.reject(new Error('Database error')));

      const response = await request(app)
        .post('/courses')
        .send({
          courseName: 'Test Course',
          courseCode: 'TC101',
          maxStudents: 30
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error creating course' });
    });
  });

  describe('GET /courses', () => {
    it('should fetch all courses', async () => {
      pool.query.mockImplementation(() => Promise.resolve({ rows: [{ courseId: 1, courseName: 'Test Course', courseCode: 'TC101', maxStudents: 30 }] }));

      const response = await request(app).get('/courses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ courseId: 1, courseName: 'Test Course', courseCode: 'TC101', maxStudents: 30 }]);
    });

    it('should return an error when fetching courses', async () => {
      pool.query.mockImplementation(() => Promise.reject(new Error('Database error')));

      const response = await request(app).get('/courses');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching courses' });
    });
  });

//   describe('GET /courses/:id', () => {
//     it('should fetch a single course by ID', async () => {
//       pool.query.mockImplementation(() => Promise.resolve({ rows: [{ courseId: 1, courseName: 'Test Course', courseCode: 'TC101', maxStudents: 30 }] }));

//       const response = await request(app).get('/courses/1');

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({ courseId: 1, courseName: 'Test Course', courseCode: 'TC101', maxStudents: 30 });
//     });

//     it('should return 404 if course not found', async () => {
//       pool.query.mockImplementation(() => Promise.resolve({ rows: [] }));

//       const response = await request(app).get('/courses/1');

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ message: 'Course not found' });
//     });

//     it('should return an error when fetching a course', async () => {
//       pool.query.mockImplementation(() => Promise.reject(new Error('Database error')));

//       const response = await request(app).get('/courses/1');

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ message: 'Error fetching course' });
//     });
//   });

  describe('PUT /courses/:id', () => {
    it('should update a course', async () => {
      pool.query.mockImplementation(() => Promise.resolve({ rowCount: 1 }));

      const response = await request(app)
        .put('/courses/1')
        .send({
          courseName: 'Updated Course',
          courseCode: 'UC101',
          maxStudents: 50
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Course updated successfully' });
    });

    it('should return 404 if course not found for updating', async () => {
      pool.query.mockImplementation(() => Promise.resolve({ rowCount: 0 }));

      const response = await request(app)
        .put('/courses/1')
        .send({
          courseName: 'Updated Course',
          courseCode: 'UC101',
          maxStudents: 50
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Course not found' });
    });

    it('should return an error when updating a course', async () => {
      pool.query.mockImplementation(() => Promise.reject(new Error('Database error')));

      const response = await request(app)
        .put('/courses/1')
        .send({
          courseName: 'Updated Course',
          courseCode: 'UC101',
          maxStudents: 50
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error updating course' });
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should delete a course', async () => {
      pool.query.mockImplementation(() => Promise.resolve({ rowCount: 1 }));

      const response = await request(app).delete('/courses/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Course deleted successfully' });
    });

    it('should return 404 if course not found for deletion', async () => {
      pool.query.mockImplementation(() => Promise.resolve({ rowCount: 0 }));

      const response = await request(app).delete('/courses/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Course not found' });
    });

    it('should return an error when deleting a course', async () => {
      pool.query.mockImplementation(() => Promise.reject(new Error('Database error')));

      const response = await request(app).delete('/courses/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error deleting course' });
    });
  });

  describe('POST /enroll-course', () => {
    it('should enroll in the course successfully', async () => {
      pool.query.mockImplementation((text, params, callback) => {
        callback(null, { rows: [] }); // Simulate successful query
      });

      const response = await request(app)
        .post('/enroll-course')
        .send({ courseId: '2' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Successfully enrolled in the course' });
    });

    it('should return a database error', async () => {
      pool.query.mockImplementation((text, params, callback) => {
        callback(new Error('Database error'), null); // Simulate database error
      });

      const response = await request(app)
        .post('/enroll-course')
        .send({ courseId: '2' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /enrolled-courses', () => {
    it('should fetch all enrolled courses', async () => {
      pool.query.mockImplementation((text, params, callback) => {
        callback(null, {
          rows: [
            { courseId: 1, courseCode: 'TC101', courseName: 'Test Course' },
            { courseId: 2, courseCode: 'TC102', courseName: 'Another Test Course' }
          ]
        });
      });

      const response = await request(app).get('/enrolled-courses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { courseId: 1, courseCode: 'TC101', courseName: 'Test Course' },
        { courseId: 2, courseCode: 'TC102', courseName: 'Another Test Course' }
      ]);
    });

    it('should return an error when fetching enrolled courses', async () => {
      pool.query.mockImplementation((text, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app).get('/enrolled-courses');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /not-enrolled-courses', () => {
    it('should fetch all not-enrolled courses', async () => {
      pool.query.mockImplementation((text, params, callback) => {
        callback(null, {
          rows: [
            { courseId: 1, courseCode: 'TC101', courseName: 'Test Course', maxStudents: 30 },
            { courseId: 2, courseCode: 'TC102', courseName: 'Another Test Course', maxStudents: 40 }
          ]
        });
      });

      const response = await request(app).get('/not-enrolled-courses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { courseId: 1, courseCode: 'TC101', courseName: 'Test Course', maxStudents: 30 },
        { courseId: 2, courseCode: 'TC102', courseName: 'Another Test Course', maxStudents: 40 }
      ]);
    });

    it('should return an error when fetching not-enrolled courses', async () => {
      pool.query.mockImplementation((text, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app).get('/not-enrolled-courses');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});
