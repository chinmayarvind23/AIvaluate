import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CreateCourse from '../pageComponents/CreateCourse';

const mock = new MockAdapter(axios);

describe('CreateCourse Component', () => {
  afterEach(() => {
    mock.reset();
  });

  test('renders CreateCourse component', () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <CreateCourse />
      </Router>
    );
    expect(getByPlaceholderText('Course Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Course Number')).toBeInTheDocument();
    expect(getByPlaceholderText('Maximum Number of Students')).toBeInTheDocument();
    expect(getByText('Instructor')).toBeInTheDocument();
  });

  test('allows user to create a course', async () => {
    mock.onPost('http://localhost:4000/courses').reply(201, { message: 'Course created successfully' });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <CreateCourse />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Course Name'), { target: { value: 'Test Course' } });
    fireEvent.change(getByPlaceholderText('Course Number'), { target: { value: 'CS101' } });
    fireEvent.change(getByPlaceholderText('Maximum Number of Students'), { target: { value: '30' } });
    fireEvent.click(getByText('Create Course'));

    await waitFor(() => expect(mock.history.post.length).toBe(1));
    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      courseName: 'Test Course',
      courseCode: 'CS101',
      maxStudents: '30'
    }));
  });

  test('displays error message on course creation failure', async () => {
    mock.onPost('http://localhost:4000/courses').reply(500, { message: 'There was an error creating the course' });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <CreateCourse />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Course Name'), { target: { value: 'Test Course' } });
    fireEvent.change(getByPlaceholderText('Course Number'), { target: { value: 'CS101' } });
    fireEvent.change(getByPlaceholderText('Maximum Number of Students'), { target: { value: '30' } });
    fireEvent.click(getByText('Create Course'));

    await waitFor(() => expect(mock.history.post.length).toBe(1));
    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      courseName: 'Test Course',
      courseCode: 'CS101',
      maxStudents: '30'
    }));
  });
});
