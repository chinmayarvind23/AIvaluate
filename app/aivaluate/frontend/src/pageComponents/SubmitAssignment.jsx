// import CircumIcon from "@klarr-agency/circum-icons-react";
// import axios from 'axios';
// import { format, parseISO } from 'date-fns';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import '../GeneralStyling.css';
// import '../SubmitAssignment.css';
// import AIvaluateNavBar from '../components/AIvaluateNavBar';
// import MarkdownRenderer from '../components/MarkdownRenderer';
// import SideMenuBar from '../components/SideMenuBar';

// const SubmitAssignment = () => {
//     const courseCode = sessionStorage.getItem('courseCode');
//     const courseName = sessionStorage.getItem('courseName');

//     const navigate = useNavigate();
//     const { courseId, assignmentId } = useParams();
//     const navBarText = `${courseCode} - ${courseName}`;
//     const [files, setFiles] = useState([]);
//     const [isGraded, setIsGraded] = useState(false);
//     const [dragging, setDragging] = useState(false);
//     const [assignmentDetails, setAssignmentDetails] = useState({
//         assignmentName: '',
//         rubricName: '',
//         criteria: '',
//         dueDate: '',
//         maxObtainableGrade: '',
//         InstructorAssignedFinalGrade: '',
//         assignmentDescription: ''
//     });
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [errorMessage, setErrorMessage] = useState('');

//     const fetchAssignmentDetails = useCallback(async () => {
//         try {
//             const response = await axios.get(`/stu-api/assignment/${courseId}/${assignmentId}`, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 withCredentials: true
//             });
//             const data = response.data;
//             setAssignmentDetails(data);
//             setIsGraded(data.InstructorAssignedFinalGrade !== "--");
//         } catch (error) {
//             console.error('Error fetching assignment details:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [courseId, assignmentId]);

//     const fetchUploadedFiles = useCallback(async () => {
//         try {
//             const response = await axios.get(`/stu-api/submission/${courseId}/${assignmentId}`);
//             setUploadedFiles(response.data);
//         } catch (err) {
//             console.error('Error fetching uploaded files:', err);
//         }
//     }, [courseId, assignmentId]);

//     useEffect(() => {
//         fetchAssignmentDetails();
//         fetchUploadedFiles();
//     }, [fetchAssignmentDetails, fetchUploadedFiles]);

//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         const allowedExtensions = /(\.css|\.html|\.js|\.jsx)$/i;

//         const invalidFiles = selectedFiles.filter(file => !allowedExtensions.exec(file.name));
//         if (invalidFiles.length > 0) {
//             setErrorMessage('Please upload files with extensions .css, .html, .js, or .jsx only.');
//             setFiles([]);
//         } else {
//             setErrorMessage('');
//             setFiles(selectedFiles);
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setDragging(false);
//         const selectedFiles = Array.from(e.dataTransfer.files);
//         handleFileChange({ target: { files: selectedFiles } });
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setDragging(true);
//     };

//     const handleDragLeave = () => {
//         setDragging(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (files.length === 0) {
//             setErrorMessage('Please select files to upload.');
//             return;
//         }

//         const formData = new FormData();
//         files.forEach(file => {
//             formData.append('files', file);
//         });

//         try {
//             await axios.post(`/stu-api/upload/${courseId}/${assignmentId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             alert('Files uploaded successfully');
//             setFiles([]);
//             fetchUploadedFiles();
//         } catch (err) {
//             console.error('File upload failed:', err);
//             setErrorMessage('File upload failed. Please try again.');
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     // const navBarText = `${assignmentDetails.assignmentName} - ${assignmentDetails.assignmentDescription}`;

//     const formatDueDate = (dueDate) => {
//         const date = parseISO(dueDate);
//         return format(date, "MMMM do 'at' h:mmaaa");
//     };

//     return (
//         <div>
//             <AIvaluateNavBar navBarText={navBarText} />
//             <div className="filler-div">
//                 <SideMenuBar tab="assignments"/>
//                 <div className="main-margin">
//                     <div className="assignment-container secondary-colorbg">
//                         <div className="top-bar">
//                             <div className="drop-top">
//                                 <div className="button-box-div">
//                                     <button className="main-back-button" onClick={() => navigate(-1)}>
//                                         <CircumIcon name="circle_chev_left" className="back-button-icon-size" />
//                                     </button>
//                                 </div>
//                                 <div className="header-content">
//                                     <h1 className="assignment-title primary-color-text">{assignmentDetails.assignmentName}</h1>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="scrollable-div">
//                             <div className="due-date-div">
//                                 <div className="due-date"><h3>Due: {formatDueDate(assignmentDetails.dueDate)}</h3></div>
//                                 <div className="empty"> </div>
//                                 <div className="score">
//                                     <h3>Score: {assignmentDetails.InstructorAssignedFinalGrade}/{assignmentDetails.maxObtainableGrade}</h3>
//                                 </div>
//                             </div>
                            
//                             <div className="file-upload">
//                                 <form onSubmit={handleSubmit}>
//                                     <label htmlFor="file-upload" className="file-upload-label">
//                                         Drag files here or Click to browse files
//                                     </label>
//                                     <div
//                                         className={`file-upload ${dragging ? 'dragging' : ''}`}
//                                         onDragOver={handleDragOver}
//                                         onDragLeave={handleDragLeave}
//                                         onDrop={handleDrop}
//                                     >
//                                         <input 
//                                             type="file" 
//                                             id="file-upload" 
//                                             className="file-upload-input" 
//                                             name="files"
//                                             onChange={handleFileChange}
//                                             multiple 
//                                         />
//                                     </div>
//                                     {errorMessage && <p className="error-message">{errorMessage}</p>}
//                                     <div className="submit-right">
//                                         <h2 className="assignment-text">Assignment Details</h2>
//                                         <div className="empty"> </div>
//                                         <button className="submit-button rborder" type="submit">Submit</button>
//                                     </div>
//                                 </form>
//                                 <div className="assignment-details">
//                                     <pre className="details-content">{assignmentDetails.criteria}</pre>
//                                 </div>
//                                 <h2>Files to be uploaded</h2>
//                                 <div className="uploaded-files-container">
//                                     {files.length > 0 ? (
//                                         <ul>
//                                             {files.map((file, index) => (
//                                                 <li key={index}>
//                                                     <span>{file.name}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     ) : (
//                                         <p>No files selected yet.</p>
//                                     )}
//                                 </div>
//                                 <h2>Recently Uploaded Files</h2>
//                                 <div className="uploaded-files-container">
//                                     {uploadedFiles.length > 0 ? (
//                                         <ul>
//                                             {uploadedFiles.flatMap(submission => (
//                                                 Array.isArray(submission.files) ? submission.files.map((file, index) => (
//                                                     <li key={index}>
//                                                         <a href={`/${file}`} target="_blank" rel="noopener noreferrer">{String(file).split('/').pop()}</a>
//                                                     </li>
//                                                 )) : null
//                                             ))}
//                                         </ul>
//                                     ) : (
//                                         <p>No files uploaded yet.</p>
//                                     )}
//                                 </div>
//                                 <h2>Feedback</h2>
//                                 <div className="feedback-container">
//                                     {isGraded ? (
//                                         <div className="feedback">
//                                             <div className="score-class">
//                                                 <div className="empty"> </div>
//                                             </div>
//                                             <div className="both-feedback">
//                                                 <h3>AI Feedback</h3>
//                                                 <div className="feedback-text">
//                                                     <MarkdownRenderer markdownText={assignmentDetails.aiFeedback || ''} />
//                                                 </div>
//                                                 <h3>Evaluator Feedback</h3>
//                                                 <div className="feedback-text">
//                                                     <MarkdownRenderer markdownText={assignmentDetails.evaluatorFeedback || ''} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <h3>No feedback available yet...</h3>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SubmitAssignment;




// import CircumIcon from "@klarr-agency/circum-icons-react";
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import '../GeneralStyling.css';
// import '../SubmitAssignment.css';
// import AIvaluateNavBar from '../components/AIvaluateNavBar';
// import MarkdownRenderer from '../components/MarkdownRenderer';
// import SideMenuBar from '../components/SideMenuBar';

// const SubmitAssignment = () => {
//     const navigate = useNavigate();
//     const { courseId, assignmentId } = useParams();
//     const [file, setFile] = useState(null);
//     const [isGraded, setIsGraded] = useState(false);
//     const [assignmentDetails, setAssignmentDetails] = useState({
//         assignmentName: '',
//         rubricName: '',
//         criteria: '',
//         dueDate: '',
//         maxObtainableGrade: '',
//         InstructorAssignedFinalGrade: '',
//         assignmentDescription: ''
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchAssignmentDetails = async () => {
//             try {
//                 const response = await fetch(`/stu-api/assignment/${courseId}/${assignmentId}`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     credentials: 'include'
//                 });
//                 const data = await response.json();
//                 if (response.ok) {
//                     setAssignmentDetails(data);
//                     setIsGraded(data.InstructorAssignedFinalGrade !== "--");
//                 } else {
//                     console.error('Error fetching assignment details:', data.message);
//                 }
//             } catch (error) {
//                 console.error('Error fetching assignment details:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAssignmentDetails();
//     }, [courseId, assignmentId]);

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!file) {
//             alert('Please select a file to upload.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             await axios.post(`/stu-api/upload/${courseId}/${assignmentId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             alert('File uploaded successfully');
//         } catch (err) {
//             console.error('File upload failed:', err);
//             alert('File upload failed');
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     const navBarText = `${assignmentDetails.assignmentName} - ${assignmentDetails.assignmentDescription}`;

//     return (
//         <div>
//             <AIvaluateNavBar navBarText={navBarText} />
//             <div className="filler-div">
//             <SideMenuBar tab="assignments" />
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
//                                 <h1 className="assignment-title primary-color-text">{assignmentDetails.assignmentName} - {assignmentDetails.assignmentDescription}</h1>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="scrollable-div">
//                         <div className="due-date-div">
//                             <div className="due-date"><h3>Due: {assignmentDetails.dueDate}</h3></div>
//                             <div className="empty"> </div>
//                             <div className="score">
//                                 <h3>Score: {assignmentDetails.InstructorAssignedFinalGrade}/{assignmentDetails.maxObtainableGrade}</h3>
//                             </div>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="file-upload">
//                                 <label htmlFor="file-upload" className="file-upload-label">
//                                     Drag files here or Click to browse files
//                                 </label>
//                                 <input 
//                                     type="file" 
//                                     id="file-upload" 
//                                     className="file-upload-input" 
//                                     onChange={handleFileChange} 
//                                     required
//                                 />
//                             </div>
//                             <div className="submit-right">
//                                 <h2 className="assignment-text">Assignment Details</h2>
//                                 <div className="empty"> </div>
//                                 <button className="submit-button rborder" type="submit">Submit</button>
//                             </div>
//                         </form>
//                         <div className="assignment-details">
//                             <pre className="details-content">{assignmentDetails.criteria}</pre>
//                         </div>
//                         <h2>Feedback</h2>
//                         <div className="feedback-container">
//                             {isGraded ? (
//                                 <div className="feedback">
//                                     <div className="score-class">
//                                         <div className="empty"> </div>
//                                     </div>
//                                     <div className="both-feedback">
//                                         <h3>AI Feedback</h3>
//                                         <div className="feeback-text">
//                                             <MarkdownRenderer markdownText={assignmentDetails.aiFeedback || ''} />
//                                         </div>
//                                         <h3>Evaluator Feedback</h3>
//                                         <div className="feeback-text">
//                                             <MarkdownRenderer markdownText={assignmentDetails.evaluatorFeedback || ''} />
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
//             </div>
//         </div>
//     );
// };

// export default SubmitAssignment;




import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../GeneralStyling.css';
import '../SubmitAssignment.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SideMenuBar from '../components/SideMenuBar';

const SubmitAssignment = () => {
    const navigate = useNavigate();
    const { courseId, assignmentId } = useParams();
    const [files, setFiles] = useState([]);
    const [isGraded, setIsGraded] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [assignmentDetails, setAssignmentDetails] = useState({
        assignmentName: '',
        rubricName: '',
        criteria: '',
        dueDate: '',
        maxObtainableGrade: '',
        InstructorAssignedFinalGrade: '',
        assignmentDescription: '',
        AIFeedbackText: '' // Add this to store AI feedback
    });
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAssignmentDetails = useCallback(async () => {
        try {
            const response = await axios.get(`/stu-api/assignment/${courseId}/${assignmentId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            const data = response.data;
            setAssignmentDetails(data);
            setIsGraded(data.InstructorAssignedFinalGrade !== "--");
        } catch (error) {
            console.error('Error fetching assignment details:', error);
        } finally {
            setLoading(false);
        }
    }, [courseId, assignmentId]);

    const fetchUploadedFiles = useCallback(async () => {
        try {
            const response = await axios.get(`/stu-api/submission/${courseId}/${assignmentId}`);
            setUploadedFiles(response.data);
        } catch (err) {
            console.error('Error fetching uploaded files:', err);
        }
    }, [courseId, assignmentId]);

    useEffect(() => {
        fetchAssignmentDetails();
        fetchUploadedFiles();
    }, [fetchAssignmentDetails, fetchUploadedFiles]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const allowedExtensions = /(\.css|\.html|\.js|\.jsx)$/i;

        const invalidFiles = selectedFiles.filter(file => !allowedExtensions.exec(file.name));
        if (invalidFiles.length > 0) {
            setErrorMessage('Please upload files with extensions .css, .html, .js, or .jsx only.');
            setFiles([]);
        } else {
            setErrorMessage('');
            setFiles(selectedFiles);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const selectedFiles = Array.from(e.dataTransfer.files);
        handleFileChange({ target: { files: selectedFiles } });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            setErrorMessage('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            await axios.post(`/stu-api/upload/${courseId}/${assignmentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Files uploaded successfully');
            setFiles([]);
            fetchUploadedFiles();
        } catch (err) {
            console.error('File upload failed:', err);
            setErrorMessage('File upload failed. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navBarText = `${courseCode} - ${courseName}`;

    const formatDueDate = (dueDate) => {
        const date = parseISO(dueDate);
        return format(date, "MMMM do 'at' h:mmaaa");
    };

    const handleFileUploadChange = () => {
        // Implement this function
    };

    return (
        <div>
            <AIvaluateNavBar navBarText={navBarText} />
            <div className="filler-div">
                <SideMenuBar tab="assignments" />
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
                                    <h1 className="assignment-title primary-color-text">{assignmentDetails.assignmentName}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="scrollable-div">
                            <div className="due-date-div">
                                <div className="due-date"><h3>Due: {formatDueDate(assignmentDetails.dueDate)}</h3></div>
                                <div className="empty"> </div>
                                <div className="score">
                                    <h3>Score: {assignmentDetails.InstructorAssignedFinalGrade}/{assignmentDetails.maxObtainableGrade}</h3>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="file-upload">
                                    <label htmlFor="file-upload" className="file-upload-label">
                                        Drag files here or Click to browse files
                                    </label>
                                    <div
                                        className={`file-upload-inner ${dragging ? 'dragging' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input 
                                            type="file" 
                                            id="file-upload" 
                                            className="file-upload-input" 
                                            name="files"
                                            onChange={handleFileChange}
                                            multiple 
                                        />
                                    </div>
                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                                </div>
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Have a link? Upload it here!"
                                        className="link-upload"
                                        onChange={handleFileUploadChange}
                                     />
                                </div>
                                <div className="submit-right">
                                    <h2 className="assignment-text">Assignment Rubric/Details</h2>
                                    <div className="empty"> </div>
                                    <button className="submit-button rborder" type="submit">Submit</button>
                                </div>
                            </form>
                            <div className="assignment-details">
                                <pre className="details-content">{assignmentDetails.assignmentDescription}</pre>
                            </div>
                            <h2>Files to be uploaded</h2>
                            <div className="uploaded-files-container">
                                {files.length > 0 ? (
                                    <ul>
                                        {files.map((file, index) => (
                                            <li key={index}>
                                                <span>{file.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No files selected yet.</p>
                                )}
                            </div>
                            <h2>Recently Uploaded Files</h2>
                            <div className="uploaded-files-container">
                                {uploadedFiles.length > 0 ? (
                                    <ul>
                                        {uploadedFiles.flatMap(submission => (
                                            Array.isArray(submission.files) ? submission.files.map((file, index) => (
                                                <li key={index}>
                                                    <a href={`/${file}`} target="_blank" rel="noopener noreferrer">{String(file).split('/').pop()}</a>
                                                </li>
                                            )) : null
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No files uploaded yet.</p>
                                )}
                            </div>
                            <h2>Feedback</h2>
                            <div className="feedback-container">
                                {isGraded ? (
                                    <div className="feedback">
                                        <div className="score-class">
                                            <div className="empty"> </div>
                                        </div>
                                        <div className="both-feedback">
                                            <h3>Feedback</h3>
                                            <div className="feedback-text">
                                                <MarkdownRenderer markdownText={assignmentDetails.AIFeedbackText || 'There is no feedback on this assignment'} />
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
        </div>
    );
};

export default SubmitAssignment;
