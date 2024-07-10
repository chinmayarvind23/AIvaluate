import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../GeneralStyling.css';
import '../PublishAssignment.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';
import useParams from 'react-router-dom';

const PublishAssignment = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const courseId = sessionStorage.getItem('courseId');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const [title, setTitle] = useState(" Lab 3 - Build a Personal Portfolio Page");
    const [deadline, setDeadline] = useState("May 30 11:59 p.m.");
    const [rubricContent, setRubricContent] = useState(
        `Objective:\nCreate a personal portfolio webpage using HTML and CSS. The webpage should include sections for an introduction, skills, projects, and contact information.\n\nRequirements:\n1. HTML Structure:\n    - Use semantic HTML elements (e.g., <header>, <section>, <footer>).\n    - Include a navigation bar with links to different sections of the page.\n    - Create sections for Introduction, Skills, Projects, and Contact Information.\n\n2. CSS Styling:\n    - Use an external CSS file to style the webpage.\n    - Apply styles to ensure a visually appealing and responsive design.\n    - Use CSS Flexbox or Grid for layout.\n    - Include styles for fonts, colors, and spacing.\n\n3. Content:\n    - Introduction Section: Brief introduction about yourself with a heading and a paragraph.\n    - Skills Section: List of your skills in a visually appealing format (e.g., skill bars, icons).\n    - Projects Section: Showcase at least two projects with project titles, descriptions, and links (if available).`
    );
    const [isEdited, setIsEdited] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsEdited(true);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
        setIsEdited(true);
    };

    const handleContentChange = (e) => {
        setRubricContent(e.target.value);
        setIsEdited(true);

    };

    const handleViewSubmissions = () => {
        navigate(`/eval/selected/{"assignmentId}`);
    }

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab="rubrics"/>
            <div className="main-margin">
                <div className="rubric-div">
                    <div className="top-bar">
                        <div className="back-btn-div">
                            <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                        </div>
                        <input 
                            type="text" 
                            className="title-input" 
                            value={title} 
                            onChange={handleTitleChange} 
                        /> 
                        <p className="click-to-edit">Click to edit</p>
                    </div>
                    <div >
                        <div className="deadline">
                            <h2>Due:</h2>
                            <input 
                                type="text" 
                                className="deadline-input" 
                                value={deadline} 
                                onChange={handleDeadlineChange} 
                            /> 
                            <p className="click-to-edit">Click to edit</p>
                            <div className="empty"> </div>
                            <button className="assignment-button" onClick={handleViewSubmissions}>
                                View Submissions
                            </button>
                            <button className="assignment-button">
                                Unpublish assignment
                            </button>
                        </div>
                        <div className="main-text">
                            <textarea
                                className="rubric-text"
                                value={rubricContent}
                                onChange={handleContentChange}
                            />
                            
                        </div>
                        <p className="click-to-edit2">Click to edit</p>
                        <div className="center-button">
                            <button className="assignment-button2">
                                Submit Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublishAssignment;

