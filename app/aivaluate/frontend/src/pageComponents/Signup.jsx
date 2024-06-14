import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [major, setMajor] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password, major })
      });
      const data = await response.json();
      console.log(data); // Handle response data based on server implementation
      navigate('/login'); // Redirect upon successful signup
    } catch (error) {
      console.error('Error signing up:', error);
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
          <h1 className="primary-color-text">AI</h1><h1 className="secondary-color-bg">valuate</h1>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-form secondary-colorbg">
          <h2 className="auth-title third-color-text">Signup</h2>
          <div className="auth-toggle" style={divStyle}>
            <button className="auth-toggle-btn" onClick={() => navigate('/login/stu')}>Login</button>
            <button className="auth-toggle-btn active">Signup</button>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="First Name" className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input type="email" placeholder="Email Address" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <select className="auth-input" value={major} onChange={(e) => setMajor(e.target.value)} required>
              <option value="">Select Major</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Engineering">Engineering</option>
            </select>
            <button type="submit" className="auth-submit primary-colorbg">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
