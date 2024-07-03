import React from 'react';
import '../GeneralStyling.css';
import '../SideMenu.css';
import { Link } from 'react-router-dom'; // to prevent page reload

const SideMenuBar = ({ tab }) => {
    return (
        <div className="fourth-colorbg side-menu rborder">
            <Link to="/stu/dashboard" className={`${tab === "dashboard" ? 'primary-color-text' : 'third-color-text'}`}>Home</Link>
            <Link to="/stu/grades" className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Grades</Link>
            <Link to="/stu/assignment" className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</Link>
            <Link to="/stu/people" className={`${tab === "people" ? 'primary-color-text' : 'third-color-text'}`}>People</Link>
            <Link to="/stu/submissions" className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>Submissions</Link>
        </div>
    );
};

export default SideMenuBar;