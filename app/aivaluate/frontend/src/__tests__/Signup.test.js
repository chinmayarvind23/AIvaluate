import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Signup from '../pageComponents/Signup';

const mock = new MockAdapter(axios);

describe('Signup Component', () => {
  afterEach(() => {
    mock.reset();
  });

  test('renders Signup component', () => {
    const { getByPlaceholderText } = render(
      <Router>
        <Signup />
      </Router>
    );
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
  });

  test('allows user to sign up', async () => {
    mock.onPost('http://localhost:4000/stu/signup').reply(201, { message: 'You are now registered. Please log in' });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Major'), { target: { value: 'Computer Science' } });
    fireEvent.click(getByText('Create Account'));

    await waitFor(() => expect(mock.history.post.length).toBe(1));
    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      password2: 'password',
      major: 'Computer Science'
    }));
  });

  test('displays error message on signup failure', async () => {
    mock.onPost('http://localhost:4000/stu/signup').reply(400, { message: 'Error during signup' });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Major'), { target: { value: 'Computer Science' } });
    fireEvent.click(getByText('Create Account'));

    await waitFor(() => expect(mock.history.post.length).toBe(1));
    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      password2: 'password',
      major: 'Computer Science'
    }));
  });
});
