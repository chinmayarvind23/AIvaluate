import React, { useState } from 'react';
import '../DesignRubric.css'; // Adjust the path if needed
import '../styles.css'; // Adjust the path if needed
import SideMenuBar from '../components/SideMenuProf';
import AIvaluateNavBar from '../components/AIvaluateNavBar';

const DDesignRubric = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState({
        objective: "Create a personal portfolio webpage using HTML and CSS. The webpage should include sections for an introduction, skills, projects, and contact information.",
        requirements: {
            htmlStructure: [
                "Use semantic HTML elements (e.g., <header>, <section>, <footer>).",
                "Include a navigation bar with links to different sections of the page.",
                "Create sections for Introduction, Skills, Projects, and Contact Information."
            ],
            cssStyling: [
                "Use an external CSS file to style the webpage.",
                "Apply styles to ensure a visually appealing and responsive design.",
                "Use CSS Flexbox or Grid for layout.",
                "Include styles for fonts, colors, and spacing."
            ],
            content: [
                "Introduction Section: Brief introduction about yourself with a heading and a paragraph.",
                "Skills Section: List of your skills in a visually appealing format (e.g., skill bars, icons).",
                "Projects Section: Showcase at least two projects with project titles, descriptions, and links (if available)."
            ]
        },
        headers: {
            objective: "Objective:",
            requirements: "Requirements:",
            htmlStructure: "1. HTML Structure:",
            cssStyling: "2. CSS Styling:",
            content: "3. Content:"
        }
    });

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleContentChange = (e, section, index) => {
        const newContent = { ...content };
        if (section === 'objective' || section === 'requirements' || section === 'htmlStructure' || section === 'cssStyling' || section === 'content') {
            newContent.headers[section] = e.target.innerText;
        } else {
            newContent.requirements[section][index] = e.target.innerText;
        }
        setContent(newContent);
    };

    return (
        <div>
            <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' />
            <SideMenuBar tab='assignments' />
            <div className="assignments-container">
                <main className="content">
                    <div className="assignment-details">
                        <div className="headerr">
                            <div className="conn">
                                <button className="back-button1">&#x2190;</button>
                                <h2>Build a Personal Portfolio Page</h2>
                                <button className="edit-button" onClick={toggleEdit}>
                                    {isEditing ? "Save" : "Edit"}
                                </button>
                                <div className="objective1">
                                    <div
                                        contentEditable={isEditing}
                                        onBlur={(e) => handleContentChange(e, 'objective')}
                                        suppressContentEditableWarning={true}
                                        className={isEditing ? 'editable' : ''}
                                    >
                                        <h3>{content.headers.objective}</h3>
                                    </div>
                                    <div
                                        contentEditable={isEditing}
                                        onBlur={(e) => handleContentChange(e, 'objective')}
                                        suppressContentEditableWarning={true}
                                        className={isEditing ? 'editable' : ''}
                                    >
                                        {content.objective}
                                    </div>
                                </div>
                                <div className="requirements1">
                                    <div
                                        contentEditable={isEditing}
                                        onBlur={(e) => handleContentChange(e, 'requirements')}
                                        suppressContentEditableWarning={true}
                                        className={isEditing ? 'editable' : ''}
                                    >
                                        <h3>{content.headers.requirements}</h3>
                                    </div>
                                    <div>
                                        <div
                                            contentEditable={isEditing}
                                            onBlur={(e) => handleContentChange(e, 'htmlStructure')}
                                            suppressContentEditableWarning={true}
                                            className={isEditing ? 'editable' : ''}
                                        >
                                            <h4>{content.headers.htmlStructure}</h4>
                                        </div>
                                        <ul>
                                            {content.requirements.htmlStructure.map((item, index) => (
                                                <li
                                                    key={index}
                                                    contentEditable={isEditing}
                                                    onBlur={(e) => handleContentChange(e, 'htmlStructure', index)}
                                                    suppressContentEditableWarning={true}
                                                    className={isEditing ? 'editable' : ''}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <hr />
                                    <div>
                                        <div
                                            contentEditable={isEditing}
                                            onBlur={(e) => handleContentChange(e, 'cssStyling')}
                                            suppressContentEditableWarning={true}
                                            className={isEditing ? 'editable' : ''}
                                        >
                                            <h4>{content.headers.cssStyling}</h4>
                                        </div>
                                        <ul>
                                            {content.requirements.cssStyling.map((item, index) => (
                                                <li
                                                    key={index}
                                                    contentEditable={isEditing}
                                                    onBlur={(e) => handleContentChange(e, 'cssStyling', index)}
                                                    suppressContentEditableWarning={true}
                                                    className={isEditing ? 'editable' : ''}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <hr />
                                    <div>
                                        <div
                                            contentEditable={isEditing}
                                            onBlur={(e) => handleContentChange(e, 'content')}
                                            suppressContentEditableWarning={true}
                                            className={isEditing ? 'editable' : ''}
                                        >
                                            <h4>{content.headers.content}</h4>
                                        </div>
                                        <ul>
                                            {content.requirements.content.map((item, index) => (
                                                <li
                                                    key={index}
                                                    contentEditable={isEditing}
                                                    onBlur={(e) => handleContentChange(e, 'content', index)}
                                                    suppressContentEditableWarning={true}
                                                    className={isEditing ? 'editable' : ''}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DDesignRubric;
