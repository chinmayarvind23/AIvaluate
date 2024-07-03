import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import CircumIcon from "@klarr-agency/circum-icons-react";
import '../EvalManagerInfo.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';

const EvalManagerInfo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [courses, setCourses] = useState([
        { code: 'COSC 499', name: 'Capstone Software Engineering Project' },
        { code: 'COSC 465', name: 'Intermediate JavaScript' },
        { code: 'COSC 360', name: 'Web Programming' }
    ]);

    const handleRemoveCourse = (courseCode) => {
        setCourses(courses.filter(course => course.code !== courseCode));
    };

    return (
        <div className="admin-container">
            <AIvaluateNavBar navBarText="Admin Home Portal" />
            <SideMenuBarAdmin tab="studentManager" />
            <div className="details-container">
                <div className="user-info">
                    <div className="user-details">
                        <h2>Scott Fazackerley</h2>
                        <label>
                            <input type="checkbox" /> Teaching Assistant
                        </label>
                        <div className="action-buttons">
                            <button className="delete-button">Delete user</button>
                            <button className="create-button">Create user</button>
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
