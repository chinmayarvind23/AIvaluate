import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="logo">
        <div className="logoText">
          <h1 className="primary-color-text">AI</h1><h1 className="secondary-color-text">valuate</h1>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-form secondary-colorbg">
          <h2 className="auth-title third-color-text">Forgot password</h2>
          <input type="email" placeholder="Enter email address" className="auth-input" />
          <input type="email" placeholder="Confirm email address" className="auth-input" />
          <button className="auth-submit primary-colorbg" onClick={() => navigate('/Dashboard')}>Send Email</button>
          <a href="login" className="back-to-login primary-color-text">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
