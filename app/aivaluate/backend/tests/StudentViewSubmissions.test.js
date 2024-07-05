import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StudentViewSubmissions from '../path/to/StudentViewSubmissions';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

test('fetches and displays course details', async () => {
  fetch.mockResponses(
    JSON.stringify({ courseCode: 'CS101', courseName: 'Introduction to Programming' }),
    JSON.stringify([
      { assignmentKey: 'Assignment 1', isGraded: true, studentId: 1 },
      { assignmentKey: 'Assignment 2', isGraded: false, studentId: 1 }
    ])
  );

  render(
    <Router>
      <StudentViewSubmissions />
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText('CS101 - Introduction to Programming')).toBeInTheDocument();
  });
});

test('fetches and displays submissions', async () => {
  fetch.mockResponses(
    JSON.stringify({ courseCode: 'CS101', courseName: 'Introduction to Programming' }),
    JSON.stringify([
      { assignmentKey: 'Assignment 1', isGraded: true, studentId: 1 },
      { assignmentKey: 'Assignment 2', isGraded: false, studentId: 1 }
    ])
  );

  render(
    <Router>
      <StudentViewSubmissions />
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText('Assignment 1 Submission')).toBeInTheDocument();
    expect(screen.getByText('Marked as graded')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2 Submission')).toBeInTheDocument();
  });
});
