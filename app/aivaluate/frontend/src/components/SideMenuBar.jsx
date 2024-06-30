import React from 'react';
import { Link, useParams } from 'react-router-dom'; // to prevent page reload
import '../GeneralStyling.css';
import '../SideMenu.css';

const SideMenuBar = ({ tab }) => {
    const { courseId } = useParams(); // Hook to get the courseId from the URL
    return (
        <div className="fourth-colorbg side-menu rborder">
            <Link to={`/stu/dashboard`} className={`${tab === "dashboard" ? 'primary-color-text' : 'third-color-text'}`}>Home</Link>
            <Link to={`/stu/grades/${courseId}`} className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Grades</Link>
            <Link to={`/stu/assignment/${courseId}`} className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</Link>
            <Link to={`/stu/people/${courseId}`} className={`${tab === "people" ? 'primary-color-text' : 'third-color-text'}`}>People</Link>
            <Link to={`/stu/submissions/${courseId}`} className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>Submissions</Link>
        </div>
    );
};

export default SideMenuBar;
