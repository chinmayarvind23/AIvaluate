import React from 'react';
import '../Auth.css';

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Login</h2>
        <div className="auth-toggle">
          <button className="auth-toggle-btn active">Login</button>
          <button className="auth-toggle-btn">Signup</button>
        </div>
        <input type="email" placeholder="Email Address" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <a href="#" className="forgot-password">Forgot Password?</a>
        <button className="auth-submit">Login</button>
      </div>
    </div>
  );
};

export default Login;
