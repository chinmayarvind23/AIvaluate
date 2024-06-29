import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../GeneralStyling.css';
import '../SubmitAssignment.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const SubmitAssignment = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [assignmentTitle, setAssignmentTitle] = useState("Lab 3 - Build a Personal Portfolio Page");
    const [dueDate, setDueDate] = useState("May 30 11:59 p.m.");
    const [assignmentDetails, setAssignmentDetails] = useState(
        `Objective:
Create a personal portfolio webpage using HTML and CSS. The webpage should include sections for an introduction, skills, projects, and contact information.

Requirements:
1. HTML Structure:
    - Use semantic HTML elements (e.g., <header>, <section>, <footer>).
    - Include a navigation bar with links to different sections of the page.
    - Create sections for Introduction, Skills, Projects, and Contact Information.

2. CSS Styling:
    - Use an external CSS file to style the webpage.
    - Apply styles to ensure a visually appealing and responsive design.
    - Use CSS Flexbox or Grid for layout.
    - Include styles for fonts, colors, and spacing.

3. Content:
    - Introduction Section: Brief introduction about yourself with a heading and a paragraph.
    - Skills Section: List of your skills in a visually appealing format (e.g., skill bars, icons).
    - Projects Section: Showcase at least two projects with project titles, descriptions, and links (if available).`
    );

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        // Logic for submitting the assignment
        console.log('File submitted:', file);
    };

    return (
        <div>
            <AIvaluateNavBar navBarText="Course number - Course Name" />
            <SideMenuBar tab="assignments"/>
            <div className="assignment-container rborder secondary-colorbg">
                <div className="top-bar">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <CircumIcon name="circle_chev_left" className="icon-size" />
                    </button>
                    <div className="header-content">
                        <h1 className="assignment-title primary-color-text">{assignmentTitle}</h1>
                    </div>
                    
                </div>
                <h3 className="due-date">Due: {dueDate}</h3>
                <div className="file-upload">
                    <label htmlFor="file-upload" className="file-upload-label">
                        Drag files here or Click to browse files
                    </label>
                    <input 
                        type="file" 
                        id="file-upload" 
                        className="file-upload-input" 
                        onChange={handleFileChange} 
                    />
                </div>
                <div className="assignment-details">
                    <pre className="details-content">{assignmentDetails}</pre>
                </div>
                <button className="submit-button secondary-button rborder" onClick={handleSubmit}>Submit</button>
                <h3>*Not yet submitted</h3>
            </div>
        </div>
    );
};

export default SubmitAssignment;
