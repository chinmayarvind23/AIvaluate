import React from 'react';
import '../Auth.css';

const Signup = () => {
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Signup</h2>
        <div className="auth-toggle">
          <button className="auth-toggle-btn">Login</button>
          <button className="auth-toggle-btn active">Signup</button>
        </div>
        <input type="text" placeholder="First Name" className="auth-input" />
        <input type="text" placeholder="Last Name" className="auth-input" />
        <select className="auth-input">
          <option>Select Major</option>
          <option>Computer Science</option>
          <option>Mathematics</option>
          <option>Engineering</option>
        </select>
        <input type="email" placeholder="Email Address" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <input type="password" placeholder="Confirm Password" className="auth-input" />
        <button className="auth-submit">Create Account</button>
      </div>
    </div>
  );
};

export default Signup;
