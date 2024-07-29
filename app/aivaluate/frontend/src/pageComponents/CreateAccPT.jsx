import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';
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
        
            if (response.status === 201) {
              toast.success('User successfully registered!');
              console.log('User successfully registered!');
            } else if (response.status === 400) {
              console.error('Duplicate email error:', response.data.error);
              toast.error('Email already exists');
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            onClose();
          } catch (error) {
            console.error('Error registering evaluator:', error);
            setMessage('Failed to register evaluator, the email is already in use.');
            toast.error('Failed to register evaluator, the email is already in use.');
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

  return (
    <div className="admin-home-portal">
      <ToastContainer />
      <AIvaluateNavBar navBarText="Admin Home Portal" />
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
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </label>
                <label>
                  Last Name:
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
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
  );
};

export default CreateAccPT;
