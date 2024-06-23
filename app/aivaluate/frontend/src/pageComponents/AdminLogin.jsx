import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
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
          <input type="email" placeholder="Email Address" className="auth-input" />
          <input type="password" placeholder="Password" className="auth-input" />
          <a href="forgotpassword" className="forgot-password primary-color-text">Forgot Password?</a>
          <button className="auth-submit primary-colorbg" onClick={() => navigate('/Dashboard')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;