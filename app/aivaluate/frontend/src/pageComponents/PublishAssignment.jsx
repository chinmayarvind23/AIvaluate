import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PublishAssignment.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const PublishAssignment = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(" Lab 3 - Build a Personal Portfolio Page");
    const [deadline, setDeadline] = useState(" DUE: May 30 11:59 p.m.");
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

    // const handlePublish = () => {
    //     navigate('/published-rubric');
    // };
    const handleViewSubmissions = () => {
        navigate('/eval/submissions/:courseId'); // 
    }

    return (
        <div>
            <AIvaluateNavBarEval navBarText="Course number - Course Name" />
            <SideMenuBarEval tab="rubrics"/>
            <div className="rubric-container rborder secondary-colorbg">
                <div className="line-up-title">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <CircumIcon name="circle_chev_left" className="icon-size" />
                    </button>
                    <input 
                        type="text" 
                        className="title-input primary-color-text" 
                        value={title} 
                        onChange={handleTitleChange} 
                    /> 
                    
                </div>
                <div className="line-up-deadline">
                    <input 
                        type="text" 
                        className="deadline-input primary-color-text" 
                        value={deadline} 
                        onChange={handleDeadlineChange} 
                    /> 
                    
                </div>
                <div className="line-main-text">
                    <textarea
                        className="rubric-textarea"
                        value={rubricContent}
                        onChange={handleContentChange}
                    />
                    
                </div>
                <div className="bottom-bar">
                    <div className="empty-space"></div>
                    {/* <button 
                        className={`confirm-button ${isEdited ? 'secondary-button' : 'disabled-button'} rborder`} 
                        disabled={!isEdited}
                    >
                        CLICK TO CONFIRM CHANGES
                    </button> */}
                    <button 
                        className="view-submissions-button third-buttonn rborder"
                        onClick={handleViewSubmissions}
                    >
                        View Student Submissions
                    </button>
                    <button 
                        className="confirm-button secondary-buttonn rborder"
                        // onClick={handlePublish}
                    >
                        Unpublish assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishAssignment;
