import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/stu/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      console.log(data); // Handle response data based on server implementation
      navigate('/dashboard'); // Redirect upon successful login
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const divStyle = {
    border: '1px solid black',
    borderRadius: '25px'
  };

  return (
    <div className="background">
      <div className="logo">
        <div className="logoText">
          <h1 className="primary-color-text">AI</h1><h1 className="secondary-color-text">valuate</h1>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-form secondary-colorbg">
          <h2 className="auth-title third-color-text">Login</h2>
          <div className="auth-toggle" style={divStyle}>
            <button className="auth-toggle-btn active">Login</button>
            <button className="auth-toggle-btn" onClick={() => navigate('/Signup')}>Signup</button>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email Address" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a href="forgotpassword" className="forgot-password primary-color-text">Forgot Password?</a>
            <button className="auth-submit primary-colorbg" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
