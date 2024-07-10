// import CircumIcon from "@klarr-agency/circum-icons-react";
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';
// import '../EditRubric.css';
// import '../GeneralStyling.css';
// import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
// import SideMenuBarEval from '../components/SideMenuBarEval';

// const EditRubric = () => {
//     const navigate = useNavigate();
//     const { id } = useParams(); // Assuming the route contains an id parameter for the rubric
//     const [title, setTitle] = useState("");
//     const [rubricContent, setRubricContent] = useState("");
//     const [isEdited, setIsEdited] = useState(false);
//     const [isMarkdownView, setIsMarkdownView] = useState(true);
//     const [errorMessage, setErrorMessage] = useState('');

//     useEffect(() => {
//         fetchRubric();
//     }, []);


//     const fetchRubric = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5173/eval-api/rubrics/${id}`);
//             setTitle(response.data.title);
//             setRubricContent(response.data.criteria);
//         } catch (error) {
//             console.error('Error fetching rubric:', error);
//             setErrorMessage('Failed to fetch rubric. Please check the server connection.');
//         }
//     };

//     const handleTitleChange = (e) => {
//         setTitle(e.target.value);
//         setIsEdited(true);
//     };

//     const handleContentChange = (e) => {
//         setRubricContent(e.target.value);
//         setIsEdited(true);
//     };

//     const saveRubric = async () => {
//         if (!title || !rubricContent) {
//             setErrorMessage('Both title and content must be filled out to save changes.');
//             return;
//         }

//         try {
//             await axios.put(`http://localhost:5173/eval-api/rubrics/${id}`, {
//                 title,
//                 criteria: rubricContent,
//             });
//             setIsEdited(false);
//             alert('Rubric saved successfully!');
//             navigate(-1); // Navigate back after saving
//         } catch (error) {
//             console.error('Error saving rubric:', error);
//             setErrorMessage('Failed to save rubric. Please check the server connection.');
//         }
//     };

//     return (
//         <div>
//             <AIvaluateNavBarEval navBarText="Course number - Course Name" />
//             <SideMenuBarEval tab="rubrics"/>
//             <div className="rubric-container rborder secondary-colorbg">
//                 <div className="line-up-title">
//                     <button className="back-button02" onClick={() => navigate(-1)}>
//                         <CircumIcon name="circle_chev_left" className="icon-size" />
//                     </button>
//                     <input 
//                         type="text" 
//                         className="title-input primary-color-text" 
//                         value={title} 
//                         onChange={handleTitleChange} 
//                     /> 
//                     <h3 className="edit-text">Click to edit</h3>
//                 </div>
//                 <div className="line-main-text">
//                     {isMarkdownView ? (
//                         <div onClick={() => setIsMarkdownView(false)}>
//                             <ReactMarkdown>{rubricContent}</ReactMarkdown>
//                         </div>
//                     ) : (
//                         <textarea
//                             className="rubric-textarea"
//                             value={rubricContent}
//                             onChange={handleContentChange}
//                             onBlur={() => setIsMarkdownView(true)}
//                         />
//                     )}
//                     <h3 className="edit-text-2">Click to edit</h3>
//                 </div>
//                 <div className="bottom-bar">
//                     <div className="empty-space"></div>
//                     <button 
//                         className={`confirm-button ${isEdited ? 'secondary-button' : 'disabled-button'} rborder`} 
//                         disabled={!isEdited}
//                         onClick={saveRubric}
//                     >
//                         CLICK TO CONFIRM CHANGES
//                     </button>
//                     {errorMessage && <div className="error-message">{errorMessage}</div>}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditRubric;
import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../EditRubric.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EditRubric = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("Build a Personal Portfolio Page Rubric");
    const [rubricContent, setRubricContent] = useState(
        `Objective:\nCreate a personal portfolio webpage using HTML and CSS. The webpage should include sections for an introduction, skills, projects, and contact information.\n\nRequirements:\n1. HTML Structure:\n    - Use semantic HTML elements (e.g., <header>, <section>, <footer>).\n    - Include a navigation bar with links to different sections of the page.\n    - Create sections for Introduction, Skills, Projects, and Contact Information.\n\n2. CSS Styling:\n    - Use an external CSS file to style the webpage.\n    - Apply styles to ensure a visually appealing and responsive design.\n    - Use CSS Flexbox or Grid for layout.\n    - Include styles for fonts, colors, and spacing.\n\n3. Content:\n    - Introduction Section: Brief introduction about yourself with a heading and a paragraph.\n    - Skills Section: List of your skills in a visually appealing format (e.g., skill bars, icons).\n    - Projects Section: Showcase at least two projects with project titles, descriptions, and links (if available).`
    );
    const [isEdited, setIsEdited] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsEdited(true);
    };

    const handleContentChange = (e) => {
        setRubricContent(e.target.value);
        setIsEdited(true);
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText="Course number - Course Name" />
            <SideMenuBarEval tab="rubrics"/>
            <div className="main-margin">
                <div className="top-bar">
                    <div className="back-btn-div">
                        <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                    </div>
                    <h1>Rubric:</h1>
                    <input 
                        type="text" 
                        className="title-rubric" 
                        value={title} 
                        onChange={handleTitleChange} 
                    /> 
                    <h3 className="edit-text">Click to edit</h3>
                </div>
                <div className="main-text2">
                    <textarea
                        className="rubric-text2"
                        value={rubricContent}
                        onChange={handleContentChange}
                    />
                    <h3 className="edit-textt">Click to edit</h3>
                </div>
                <div className="bottom-bar">
                    <div className="empty"></div>
                    <button 
                        className={`confirm-button ${isEdited ? 'secondary-button' : 'disabled-button'} rborder`} 
                        disabled={!isEdited}
                    >
                        CLICK TO CONFIRM CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRubric;
