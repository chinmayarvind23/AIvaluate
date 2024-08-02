// Import necessary modules
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const logger = require('../logger');  // Make sure the path to your logger is correct

// Mock the pg module
jest.mock('pg', () => ({
    Pool: jest.fn(() => ({
        query: jest.fn()
    }))
}));

const pool = new Pool(); // instantiate the mocked pool

const app = express();
app.use(bodyParser.json());

// Mock authentication middleware
const checkAuthenticated = (req, res, next) => {
  req.isAuthenticated = () => true; // Assume user is always authenticated for testing
  next();
};
app.use(checkAuthenticated);

// Include your AI assignment routes here
require('../path/to/your/aiAssignmentRoutes')(app, pool);  // Adjust path and parameters as necessary

// Tests for AI Assignment Routes
describe('AI Assignment Routes', () => {
  describe('POST /ai/assignments/:assignmentId/test', () => {
    it('should confirm AI service endpoint is working', async () => {
      const response = await request(app)
        .post('/ai/assignments/123/test')
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('AI service endpoint is working');
    });
  });

  describe('POST /ai/assignments/:assignmentId/process-submissions', () => {
    it('should process submissions successfully', async () => {
      // Mock database query to simulate fetching submissions
      pool.query.mockResolvedValue({ rows: [{ submissionId: '1', result: 'Processed' }] });

      const response = await request(app)
        .post('/ai/assignments/123/process-submissions')
        .send({ instructorId: '456', courseId: '789' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Submission processing completed' });
    });

    it('should handle errors during submission processing', async () => {
      // Simulate an error in fetching or processing submissions
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/ai/assignments/123/process-submissions')
        .send({ instructorId: '456', courseId: '789' });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to process submissions' });
    });
  });
});
