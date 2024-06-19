import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/stu/reset/${token}`, { password });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form secondary-colorbg">
        <h2 className="auth-title third-color-text">Reset Password</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="New Password" 
              className="auth-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button className="auth-submit primary-colorbg" type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;