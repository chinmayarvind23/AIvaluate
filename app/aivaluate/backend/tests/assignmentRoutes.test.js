// // tests/assignmentRoutes.test.js
// const request = require('supertest');
// const express = require('express');
// const bodyParser = require('body-parser');

// // Mocking the database pool
// const pool = {
//   query: jest.fn()
// };

// // Mocking the authentication
// const checkAuthenticated = (req, res, next) => {
//   req.user = { studentId: '1' }; // Mocked user
//   next();
// };

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Mocking the assignment routes
// const router = express.Router();

// router.post('/', async (req, res) => {
//   const { courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription } = req.body;

//   try {
//     const result = await pool.query(
//       'INSERT INTO "Assignment" ("courseId", "dueDate", "assignmentKey", "maxObtainableGrade", "assignmentDescription") VALUES ($1, $2, $3, $4, $5) RETURNING "assignmentId"',
//       [courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription]
//     );
//     res.status(201).send({ assignmentId: result.rows[0].assignmentId, message: 'Assignment created successfully' });
//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     res.status(500).send({ message: 'Error creating assignment' });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM "Assignment"');
//     res.status(200).send(result.rows);
//   } catch (error) {
//     console.error('Error fetching assignments:', error);
//     res.status(500).send({ message: 'Error fetching assignments' });
//   }
// });

// router.get('/:assignmentId', async (req, res) => {
//   const { assignmentId } = req.params;

//   try {
//     const result = await pool.query('SELECT * FROM "Assignment" WHERE "assignmentId" = $1', [assignmentId]);
//     if (result.rows.length === 0) {
//       return res.status(404).send({ message: 'Assignment not found' });
//     }
//     res.status(200).send(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching assignment:', error);
//     res.status(500).send({ message: 'Error fetching assignment' });
//   }
// });

// router.put('/:assignmentId', async (req, res) => {
//   const { assignmentId } = req.params;
//   const { courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE "Assignment" SET "courseId" = $1, "dueDate" = $2, "assignmentKey" = $3, "maxObtainableGrade" = $4, "assignmentDescription" = $5 WHERE "assignmentId" = $6 RETURNING *',
//       [courseId, dueDate, assignmentKey, maxObtainableGrade, assignmentDescription, assignmentId]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send({ message: 'Assignment not found' });
//     }
//     res.status(200).send(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating assignment:', error);
//     res.status(500).send({ message: 'Error updating assignment' });
//   }
// });

// router.delete('/:assignmentId', async (req, res) => {
//   const { assignmentId } = req.params;

//   try {
//     const result = await pool.query('DELETE FROM "Assignment" WHERE "assignmentId" = $1 RETURNING *', [assignmentId]);
//     if (result.rows.length === 0) {
//       return res.status(404).send({ message: 'Assignment not found' });
//     }
//     res.status(204).send();
//   } catch (error) {
//     console.error('Error deleting assignment:', error);
//     res.status(500).send({ message: 'Error deleting assignment' });
//   }
// });

// app.use('/assignments', router);

// describe('Assignment Routes', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /assignments', () => {
//     it('should create a new assignment', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [{ assignmentId: 1 }] });
//       });

//       const response = await request(app)
//         .post('/assignments')
//         .send({
//           courseId: 1,
//           dueDate: '2024-12-31',
//           assignmentKey: 'assignment-1',
//           maxObtainableGrade: 100,
//           assignmentDescription: 'Test Assignment'
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({ assignmentId: 1, message: 'Assignment created successfully' });
//     });

//     it('should return an error when creating an assignment', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(new Error('Database error'), null);
//       });

//       const response = await request(app)
//         .post('/assignments')
//         .send({
//           courseId: 1,
//           dueDate: '2024-12-31',
//           assignmentKey: 'assignment-1',
//           maxObtainableGrade: 100,
//           assignmentDescription: 'Test Assignment'
//         });

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ message: 'Error creating assignment' });
//     });
//   });

//   describe('GET /assignments', () => {
//     it('should fetch all assignments', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [{ assignmentId: 1, assignmentKey: 'assignment-1' }] });
//       });

//       const response = await request(app).get('/assignments');

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual([{ assignmentId: 1, assignmentKey: 'assignment-1' }]);
//     });

//     it('should return an error when fetching assignments', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(new Error('Database error'), null);
//       });

//       const response = await request(app).get('/assignments');

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ message: 'Error fetching assignments' });
//     });
//   });

//   describe('GET /assignments/:assignmentId', () => {
//     it('should fetch an assignment by ID', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [{ assignmentId: 1, assignmentKey: 'assignment-1' }] });
//       });

//       const response = await request(app).get('/assignments/1');

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({ assignmentId: 1, assignmentKey: 'assignment-1' });
//     });

//     it('should return 404 if assignment not found', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [] });
//       });

//       const response = await request(app).get('/assignments/1');

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ message: 'Assignment not found' });
//     });

//     it('should return an error when fetching an assignment by ID', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(new Error('Database error'), null);
//       });

//       const response = await request(app).get('/assignments/1');

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ message: 'Error fetching assignment' });
//     });
//   });

//   describe('PUT /assignments/:assignmentId', () => {
//     it('should update an assignment', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, {
//           rows: [
//             {
//               assignmentId: 1,
//               courseId: 1,
//               dueDate: '2024-12-31',
//               assignmentKey: 'updated-assignment-1',
//               maxObtainableGrade: 100,
//               assignmentDescription: 'Updated Assignment'
//             }
//           ]
//         });
//       });

//       const response = await request(app)
//         .put('/assignments/1')
//         .send({
//           courseId: 1,
//           dueDate: '2024-12-31',
//           assignmentKey: 'updated-assignment-1',
//           maxObtainableGrade: 100,
//           assignmentDescription: 'Updated Assignment'
//         });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({
//         assignmentId: 1,
//         courseId: 1,
//         dueDate: '2024-12-31',
//         assignmentKey: 'updated-assignment-1',
//         maxObtainableGrade: 100,
//         assignmentDescription: 'Updated Assignment'
//       });
//     });

//     it('should return 404 if assignment not found for update', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [] });
//       });

//       const response = await request(app)
//         .put('/assignments/1')
//         .send({
//           courseId: 1,
//           dueDate: '2024-12-31',
//           assignmentKey: 'updated-assignment-1',
//           maxObtainableGrade: 100,
//           assignmentDescription: 'Updated Assignment'
//         });

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ message: 'Assignment not found' });
//     });

//     it('should return an error when updating an assignment', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(new Error('Database error'), null);
//       });

//       const response = await request(app)
//         .put('/assignments/1')
//         .send({
//           courseId: 1,
//           dueDate: '2024-12-31',
//           assignmentKey: 'updated-assignment-1',
//           maxObtainableGrade: 100,
//           assignmentDescription: 'Updated Assignment'
//         });

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ message: 'Error updating assignment' });
//     });
//   });

//   describe('DELETE /assignments/:assignmentId', () => {
//     it('should delete an assignment', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [{ assignmentId: 1 }] });
//       });

//       const response = await request(app).delete('/assignments/1');

//       expect(response.status).toBe(204);
//     });

//     it('should return 404 if assignment not found for deletion', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(null, { rows: [] });
//       });

//       const response = await request(app).delete('/assignments/1');

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ message: 'Assignment not found' });
//     });

//     it('should return an error when deleting an assignment', async () => {
//       pool.query.mockImplementation((text, params, callback) => {
//         callback(new Error('Database error'), null);
//       });

//       const response = await request(app).delete('/assignments/1');

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ message: 'Error deleting assignment' });
//     });
//   });

//   // Add similar tests for rubrics and solutions routes as needed
// });
