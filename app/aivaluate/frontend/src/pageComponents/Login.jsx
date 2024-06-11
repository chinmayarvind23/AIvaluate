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
          <input type="email" placeholder="Email Address" className="auth-input" />
          <input type="password" placeholder="Password" className="auth-input" />
          <a href="#" className="forgot-password primary-color-text">Forgot Password?</a>
          <button className="auth-submit primary-colorbg" onClick={() => navigate('/Dashboard')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
