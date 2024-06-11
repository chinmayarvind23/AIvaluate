import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Signup = () => {
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
          <h1 class="primary-color-text">AI</h1><h1 class="secondary-color-bg">valuate</h1>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-form secondary-colorbg">
          <h2 className="auth-title third-color-text">Signup</h2> 
          <div className="auth-toggle" style={divStyle}>
            <button className="auth-toggle-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="auth-toggle-btn active">Signup</button>
          </div>
          <input type="text" placeholder="First Name" className="auth-input" />
          <input type="text" placeholder="Last Name" className="auth-input" />
          <input type="email" placeholder="Email Address" className="auth-input" />
          <input type="password" placeholder="Password" className="auth-input" />
          <input type="password" placeholder="Confirm Password" className="auth-input" />
          <select className="auth-input">
            <option>Select Major</option>
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Engineering</option>
          </select>
          <button className="auth-submit primary-colorbg">Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
