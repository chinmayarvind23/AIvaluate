// import CircumIcon from "@klarr-agency/circum-icons-react";
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../GeneralStyling.css';
// import '../SubmitAssignment.css';
// import AIvaluateNavBar from '../components/AIvaluateNavBar';
// import MarkdownRenderer from '../components/MarkdownRenderer';
// import SideMenuBar from '../components/SideMenuBar';

// const SubmitAssignment = () => {
//     const navigate = useNavigate();
//     const [file, setFile] = useState(null);
//     const [assignmentTitle, setAssignmentTitle] = useState("Lab 3 - Build a Personal Portfolio Page");
//     const [isGraded, setIsGraded] = useState(false);
//     const assignmentName = "Lab 3";
//     const rubricName = "Build a Personal Portfolio Page";
//     const [dueDate, setDueDate] = useState("May 30 11:59 p.m.");
//     const criteria = `Objective:
//                     Create a personal portfolio webpage using HTML and CSS. The webpage should include sections for an introduction, skills, projects, and contact information.

//                     Requirements:
//                     1. HTML Structure:
//                         - Use semantic HTML elements (e.g., <header>, <section>, <footer>).
//                         - Include a navigation bar with links to different sections of the page.
//                         - Create sections for Introduction, Skills, Projects, and Contact Information.

//                     2. CSS Styling:
//                         - Use an external CSS file to style the webpage.
//                         - Apply styles to ensure a visually appealing and responsive design.
//                         - Use CSS Flexbox or Grid for layout.
//                         - Include styles for fonts, colors, and spacing.

//                     3. Content:
//                         - Introduction Section: Brief introduction about yourself with a heading and a paragraph.
//                         - Skills Section: List of your skills in a visually appealing format (e.g., skill bars, icons).
//                         - Projects Section: Showcase at least two projects with project titles, descriptions, and links (if available).`;

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleSubmit = () => {
//         // Logic for submitting the assignment
//         console.log('File submitted:', file);
//     };
//     const Feedback = true;
//     const maxObtainableGrade = 34;
//     const InstructorAssignedFinalGrade = 32;
//     const markdownText = `
//         # Hello, World!

//         This is a paragraph in **Markdown**.

//         - Item 1
//         - Item 2
//         - Item 3

//         [Link to Google](https://www.google.com)
//         `;

//     const navBarText = `${courseCode} - ${courseName}`;

//     return (
//         <div>
//             <AIvaluateNavBar navBarText={navBarText} />
//             <SideMenuBar tab="assignments"/>
//             <div className="main-margin">
//                 <div className="assignment-container secondary-colorbg">
//                     <div className="top-bar">
//                         <div className="drop-top">
//                             <div className="button-box-div">
//                                 <button className="main-back-button" onClick={() => navigate(-1)}>
//                                     <CircumIcon name="circle_chev_left" className="back-button-icon-size" />
//                                 </button>
//                             </div>
//                             <div className="header-content">
//                                 <h1 className="assignment-title primary-color-text">{assignmentName} - {rubricName}</h1>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="scrollable-div">
//                         <div className="due-date-div">
//                             <div className="due-date"><h3>Due: {dueDate}</h3></div>
//                             <div className="empty"> </div>
//                             <div className="score">
//                                 <h3>Score: {InstructorAssignedFinalGrade}/{maxObtainableGrade}</h3>
//                             </div>
//                             {/* <button className="submit-button rborder" onClick={handleSubmit}>Submit</button> */}
//                         </div>
                        
//                         <div className="file-upload">
//                             <label htmlFor="file-upload" className="file-upload-label">
//                                 Drag files here or Click to browse files
//                             </label>
//                             <input 
//                                 type="file" 
//                                 id="file-upload" 
//                                 className="file-upload-input" 
//                                 onChange={handleFileChange} 
//                             />
//                         </div>
//                         <div className="submit-right">
//                             <h2 className="assignment-text">Assignment Details</h2>
//                             <div className="empty"> </div>
//                             <button className="submit-button rborder" onClick={handleSubmit}>Submit</button>
//                         </div>
//                         <div className="assignment-details">
//                             <pre className="details-content">{criteria}</pre>
//                         </div>
//                         <h2>Feedback</h2>
//                         <div className="feedback-container">
//                             {isGraded ? (
//                                 <div className="feedback">
//                                         <div className="score-class">
//                                             <div className="empty"> </div>
//                                         </div>
//                                     <div className="both-feedback">
//                                         <h3>AI Feedback</h3>
//                                         <div className="feeback-text">
//                                             <MarkdownRenderer markdownText={markdownText} />
//                                         </div>
//                                         <h3>Evaluator Feedback</h3>
//                                         <div className="feeback-text">
//                                             <MarkdownRenderer markdownText={markdownText} />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <h3>No feedback available yet...</h3>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SubmitAssignment;

import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../GeneralStyling.css';
import '../SubmitAssignment.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SideMenuBar from '../components/SideMenuBar';

const SubmitAssignment = () => {
    const navigate = useNavigate();
    const { courseId, assignmentId } = useParams();
    const [file, setFile] = useState(null);
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [isGraded, setIsGraded] = useState(false);
    const [assignmentDetails, setAssignmentDetails] = useState({
        assignmentName: '',
        rubricName: '',
        criteria: '',
        dueDate: '',
        maxObtainableGrade: '',
        InstructorAssignedFinalGrade: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const response = await fetch(`/stu-api/assignment/${courseId}/${assignmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setAssignmentDetails(data);
                    setAssignmentTitle(`${data.assignmentName} - ${data.rubricName}`);
                    setIsGraded(data.InstructorAssignedFinalGrade !== "--");
                } else {
                    console.error('Error fetching assignment details:', data.message);
                }
            } catch (error) {
                console.error('Error fetching assignment details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentDetails();
    }, [courseId, assignmentId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        // Logic for submitting the assignment
        console.log('File submitted:', file);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const navBarText = `Jerry please help`;

    return (
        <div>
            <AIvaluateNavBar navBarText={navBarText} />
            <SideMenuBar tab="assignments"/>
            <div className="main-margin">
                <div className="assignment-container secondary-colorbg">
                    <div className="top-bar">
                        <div className="drop-top">
                            <div className="button-box-div">
                                <button className="main-back-button" onClick={() => navigate(-1)}>
                                    <CircumIcon name="circle_chev_left" className="back-button-icon-size" />
                                </button>
                            </div>
                            <div className="header-content">
                                <h1 className="assignment-title primary-color-text">{assignmentDetails.assignmentName} - {assignmentDetails.rubricName}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="scrollable-div">
                        <div className="due-date-div">
                            <div className="due-date"><h3>Due: {assignmentDetails.dueDate}</h3></div>
                            <div className="empty"> </div>
                            <div className="score">
                                <h3>Score: {assignmentDetails.InstructorAssignedFinalGrade}/{assignmentDetails.maxObtainableGrade}</h3>
                            </div>
                        </div>
                        
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
                        <div className="submit-right">
                            <h2 className="assignment-text">Assignment Details</h2>
                            <div className="empty"> </div>
                            <button className="submit-button rborder" onClick={handleSubmit}>Submit</button>
                        </div>
                        <div className="assignment-details">
                            <pre className="details-content">{assignmentDetails.criteria}</pre>
                        </div>
                        <h2>Feedback</h2>
                        <div className="feedback-container">
                            {isGraded ? (
                                <div className="feedback">
                                        <div className="score-class">
                                            <div className="empty"> </div>
                                        </div>
                                    <div className="both-feedback">
                                        <h3>AI Feedback</h3>
                                        <div className="feeback-text">
                                            <MarkdownRenderer markdownText={markdownText} />
                                        </div>
                                        <h3>Evaluator Feedback</h3>
                                        <div className="feeback-text">
                                            <MarkdownRenderer markdownText={markdownText} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <h3>No feedback available yet...</h3>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitAssignment;

