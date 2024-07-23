import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import axios from 'axios';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CreateAccPT.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';
import '../CreateAccPT.css';
import '../GeneralStyling.css';
import '../ToastStyles.css';
import '../CreateAccPT.css';
import '../GeneralStyling.css';
import '../ToastStyles.css';
import '../CreateAccPT.css';
import '../GeneralStyling.css';
import '../ToastStyles.css';

const CreateAccPT = () => {
  const navigate = useNavigate();
  const [isTeachingAssistant, setIsTeachingAssistant] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '' 
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = () => {
    setIsTeachingAssistant(!isTeachingAssistant);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        const handleRegister = async () => {
          const data = { ...formData, isTA: isTeachingAssistant };
          try {
            const response = await axios.post('http://localhost:5173/admin-api/evaluatorRegister', data, {
              withCredentials: true
            });
            toast.success('User successfully registered!');
            console.log('User successfully registered!');
            toast.success('User successfully registered!');
            console.log('User successfully registered!');
            onClose();
          } catch (error) {
            console.error('Error registering evaluator:', error);
            setMessage('Failed to register evaluator');
            toast.error('Failed to register evaluator');
            setMessage('Failed to register evaluator');
            toast.error('Failed to register evaluator');
            onClose();
          }
        };


        return (
          <div className="custom-ui">
            <h1>Confirm Registration</h1>
            <p>Are you sure you want to register this evaluator?</p>
            <div className="button-group">
              <button onClick={onClose} className="cancel-button">Cancel</button>
              <button onClick={handleRegister} className="confirm-button">Confirm</button>
            </div>
          </div>
        );
      },
      overlayClassName: "custom-overlay",
    });
  };
  };

  return (
    <div className="admin-home-portal">
      <ToastContainer />
      <ToastContainer />
      <ToastContainer />
      <AIvaluateNavBar navBarText="Admin Home Portal" />
      <div className="filler-div">
        <SideMenuBarAdmin tab="evalManager"/>
        <div className="main-margin">
          <div className="top-bar">
            <div className="back-btn-div">
              <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
            </div>
            <h1 className="eval-text">Register Evaluator</h1>
            <div className="empty"> </div>
          </div>
          <div className="content">
            <form className="user-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="box">
                  <label className="primary-text">
                    First Name:
                    <input type="text" className="main-text-space" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </label>
                  <label>
                    Last Name:
                    <input type="text" className="main-text-space" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </label>
                </div>
                <div className="box">
                  <h2>Is this a T.A.?</h2>
                  <label className="checkbox-label">
                    <div>
                      <input type="checkbox" className="checkbox-input" checked={isTeachingAssistant} onChange={handleCheckboxChange} />
                    </div>
                    <div>
                      <span className="checkbox-text">Teaching Assistant</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="box">
                  <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </label>
                  <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                  </label>
                </div>
                <button type="submit" className="create-user-button">Create user</button>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccPT;
