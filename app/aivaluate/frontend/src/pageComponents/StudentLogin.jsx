import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import '../GeneralStyling.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to log in...');
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
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
            <div className="form-group">
              <input 
                type="email" 
                id="email" 
                placeholder="Email Address" 
                className="auth-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                id="password" 
                placeholder="Password" 
                className="auth-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <a href="forgotpassword" className="forgot-password primary-color-text">Forgot Password?</a>
            <button className="auth-submit primary-colorbg" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
