import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import '../GeneralStyling.css';
import '../StudentViewSubmissions.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const StudentViewSubmissions = () => {
  const navigate = useNavigate();

  const handleNavClick = (tab) => {
    if (tab === 'submissions' && submissionsRef.current) 
    {
      submissionsRef.current.focus();
    }
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' tab='studentviewsubmissions' />
      <div className="container">
        <SideMenuBar tab="students" />
        <div className="filetab rborder secondary-colorbg">
          <div className="file-list">
            <div className="file-item">index.html</div>
            <div className="file-item">index.css</div>
            <div className="file-item">login.html</div>
            <div className="file-item">login.css</div>
            <div className="file-item">dashboard.html</div>
            <div className="file-item">dashboard.css</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentViewSubmissions;
