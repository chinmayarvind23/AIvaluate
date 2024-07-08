import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StudentViewSubmissions from '../path/to/StudentViewSubmissions';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  sessionStorage.setItem('courseCode', 'CS101');
  sessionStorage.setItem('courseName', 'Introduction to Programming');
});

test('fetches and displays course details', async () => {
  fetch.mockResponses(
    [JSON.stringify({ courseCode: 'CS101', courseName: 'Introduction to Programming' }), { status: 200 }],
    [JSON.stringify([
      { assignmentKey: 'Assignment 1', isGraded: true, studentId: 1 },
      { assignmentKey: 'Assignment 2', isGraded: false, studentId: 1 }
    ]), { status: 200 }]
  );

  render(
    <Router>
      <StudentViewSubmissions />
    </Router>
  );

  expect(await screen.findByText('CS101 - Introduction to Programming')).toBeInTheDocument();
  expect(await screen.findByText('Assignment 1 Submission')).toBeInTheDocument();
  expect(await screen.findByText('Marked as graded')).toBeInTheDocument();
  expect(await screen.findByText('Assignment 2 Submission')).toBeInTheDocument();
});

test('search filters the submissions', async () => {
  fetch.mockResponses(
    [JSON.stringify({ courseCode: 'CS101', courseName: 'Introduction to Programming' }), { status: 200 }],
    [JSON.stringify([
      { assignmentKey: 'Assignment 1', isGraded: true, studentId: 1 },
      { assignmentKey: 'Assignment 2', isGraded: false, studentId: 1 },
      { assignmentKey: 'Assignment 3', isGraded: true, studentId: 2 }
    ]), { status: 200 }]
  );

  render(
    <Router>
      <StudentViewSubmissions />
    </Router>
  );

  expect(await screen.findByText('Assignment 1 Submission')).toBeInTheDocument();
  expect(await screen.findByText('Assignment 2 Submission')).toBeInTheDocument();
  expect(await screen.findByText('Assignment 3 Submission')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Assignment 1' } });

  expect(await screen.findByText('Assignment 1 Submission')).toBeInTheDocument();
  expect(screen.queryByText('Assignment 2 Submission')).not.toBeInTheDocument();
  expect(screen.queryByText('Assignment 3 Submission')).not.toBeInTheDocument();
});

test('pagination works correctly', async () => {
  const submissions = Array.from({ length: 8 }, (_, i) => ({
    assignmentKey: `Assignment ${i + 1}`,
    isGraded: i % 2 === 0,
    studentId: i + 1
  }));

  fetch.mockResponses(
    [JSON.stringify({ courseCode: 'CS101', courseName: 'Introduction to Programming' }), { status: 200 }],
    [JSON.stringify(submissions), { status: 200 }]
  );

  render(
    <Router>
      <StudentViewSubmissions />
    </Router>
  );

  expect(await screen.findByText('Assignment 1 Submission')).toBeInTheDocument();
  expect(await screen.findByText('Assignment 6 Submission')).toBeInTheDocument();
  expect(screen.queryByText('Assignment 7 Submission')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Next'));
  expect(await screen.findByText('Assignment 7 Submission')).toBeInTheDocument();
  expect(screen.queryByText('Assignment 1 Submission')).not.toBeInTheDocument();
  expect(await screen.findByText('Assignment 8 Submission')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Previous'));
  expect(await screen.findByText('Assignment 1 Submission')).toBeInTheDocument();
  expect(screen.queryByText('Assignment 7 Submission')).not.toBeInTheDocument();
});