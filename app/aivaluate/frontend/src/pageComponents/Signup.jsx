import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [major, setMajor] = useState('');
  const navigate = useNavigate();

  const divStyle = {
    border: '1px solid black',
    borderRadius: '25px'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/stu/signup', {
        firstName,
        lastName,
        email,
        password,
        password2,
        major
      });
      console.log('Signup successful:', response.data);
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error('There was an error signing up:', error);
    }
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
            <button className="auth-toggle-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="auth-toggle-btn active">Signup</button>
          </div>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="First Name" 
              className="auth-input" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              className="auth-input" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="auth-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="auth-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="auth-input" 
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required 
            />

            {/* Major is not required for now*/}
            {/* <select 
              className="auth-input" 
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            >
              <option value="">Select Major</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Engineering">Engineering</option>
            </select> */}
            <button className="auth-submit primary-colorbg" type="submit">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
