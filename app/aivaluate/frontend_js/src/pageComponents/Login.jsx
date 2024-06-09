import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const divStyle = {
    border: '1px solid black',
    borderRadius: '25px'
  };

  const aivaluatePurple = {
    color: '#4d24d4'
  }

  return (
    <div class="background">
      <div class="logo">
        <div class="logoText">
          <h1 style={aivaluatePurple}>AI</h1><h1>valuate</h1>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-form">
          <h2 className="auth-title">Login</h2>
          <div className="auth-toggle" style={divStyle}>
            <button className="auth-toggle-btn active">Login</button>
            <button className="auth-toggle-btn" onClick={() => navigate('/Signup')}>Signup</button>
          </div>
          <input type="email" placeholder="Email Address" className="auth-input" />
          <input type="password" placeholder="Password" className="auth-input" />
          <a href="#" className="forgot-password">Forgot Password?</a>
          <button className="auth-submit" onClick={() => navigate('/Dashboard')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
