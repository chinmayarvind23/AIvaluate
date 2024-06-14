import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../pageComponents/Login';

const mock = new MockAdapter(axios);

describe('Login Component', () => {
  afterEach(() => {
    mock.reset();
  });

  test('renders Login component', () => {
    const { getByPlaceholderText } = render(
      <Router>
        <Login />
      </Router>
    );
    expect(getByPlaceholderText('Email Address')).toBeInTheDocument();
  });

  test('allows user to log in', async () => {
    mock.onPost('http://localhost:4000/stu/login').reply(200, { message: 'Login successful' });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(getByText('Login'));

    await waitFor(() => expect(mock.history.post.length).toBe(1));
    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      email: 'test@example.com',
      password: 'password'
    }));
  });

  test('displays error message on login failure', async () => {
    mock.onPost('http://localhost:4000/stu/login').reply(401, { message: 'Invalid credentials' });

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(getByText('Login'));

    await waitFor(() => expect(mock.history.post.length).toBe(1));
    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      email: 'test@example.com',
      password: 'wrongpassword'
    }));
  });
});
