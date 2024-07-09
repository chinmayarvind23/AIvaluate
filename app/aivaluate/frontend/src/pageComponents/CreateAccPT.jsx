import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CreateAccPT.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';

const CreateAccPT = () => {
  const navigate = useNavigate();
  const [isTeachingAssistant, setIsTeachingAssistant] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    department: ''
  });

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

    const { firstname, lastname, email, password, department } = formData;

    if (!firstname || !lastname || !email || !password || !department) {
      alert('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/admin-api/create', {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
        department: department,
        hasFullAccess: !isTeachingAssistant
      });
      console.log(response.data);
      navigate('/admin/success'); // Redirect to a success page or display a success message
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
      alert(`Error creating user: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="admin-home-portal">
      <AIvaluateNavBar navBarText="Admin Home Portal" />
      <div className="main-content">
        <SideMenuBarAdmin tab="evalManager" />
        <div className="content">
          <button className="back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left" /></button>
          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="box">
                <label>
                  First Name:
                  <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
                </label>
                <label>
                  Last Name:
                  <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
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
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label>
                  Password:
                  <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </label>
                <label>
                  Department:
                  <input type="text" name="department" value={formData.department} onChange={handleChange} />
                </label>
              </div>
            </div>
            <button type="submit" className="create-user-button">Create user</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccPT;
