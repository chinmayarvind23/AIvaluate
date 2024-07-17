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
            <div className="filler-div">
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
        </div>
    );
};

export default SubmitAssignment;

