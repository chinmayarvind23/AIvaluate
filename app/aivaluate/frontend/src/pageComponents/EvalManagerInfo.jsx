import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../EvalManagerInfo.css';
import '../GeneralStyling.css';
import AIvaluateNavBarAdmin from '../components/AIvaluateNavBarAdmin';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';

const EvalManagerInfo = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [courses, setCourses] = useState([
        { code: 'COSC 499', name: 'Capstone Software Engineering Project' },
        { code: 'COSC 465', name: 'Intermediate JavaScript' },
        { code: 'COSC 360', name: 'Web Programming' }
    ]);

    const handleRemoveCourse = (courseCode) => {
        setCourses(courses.filter(course => course.code !== courseCode));
    };

    const handelRegister = () => {
        navigate(`/admin/CreateAccPT`);
    };

    return (
        <div className="admin-container">
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal" />
            <SideMenuBarAdmin tab="evalManager" />
            <div className="main-margin">
            <div className="top-bar">
                <div className="back-btn-div">
                    <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                </div>
                <h1 className="eval-text">Evaluator Info</h1>
                <div className="empty"> </div>
                <button className="create-eval" onClick={() => handelRegister()}>Register Evaluator</button>
            </div>
                <div className="user-info">
                    <div className="user-details">
                        <h2>Scott Fazackerley</h2>
                        <div className="align-check">
                            <label className="checkbox-label2 ">
                                <input type="checkbox" /> Teaching Assistant
                            </label>
                        </div>
                        <div className="action-buttons">
                            <button className="delete-button">Delete user</button>
                        </div>
                    </div>
                    <div className="info-row">
                        <span>Email:</span>
                        <span>Scott@email.com</span>
                    </div>
                    <div className="info-row">
                        <span>Password:</span>
                        <span>**********</span>
                    </div>
                    <div className="info-row">
                        <span>Department:</span>
                        <span>Faculty of Science</span>
                    </div>
                </div>
                <div className="course-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    {courses.filter(course => course.name.toLowerCase().includes(searchTerm.toLowerCase())).map((course, index) => (
                        <div className="course-item" key={index}>
                            <span>{course.code} - {course.name}</span>
                            <button className="remove-button" onClick={() => handleRemoveCourse(course.code)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EvalManagerInfo;
