import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../GeneralStyling.css';
import '../PublishAssignment.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const PublishAssignment = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navBarText = `${courseCode} - ${courseName}`;
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [rubricContent, setRubricContent] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [isPublished, setIsPublished] = useState(null);

    const fetchAssignment = async () => {
        try {
            const response = await axios.get(`http://localhost:5173/eval-api/assignments/${assignmentId}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                const { assignmentName, dueDate, criteria, isPublished } = response.data;
                setTitle(assignmentName);
                setDeadline(dueDate);
                setRubricContent(criteria);
                setIsPublished(isPublished);
                console.log("Fetched assignment:", response.data);
            } else {
                console.error('Failed to fetch assignment:', response);
            }
        } catch (error) {
            console.error('Error fetching assignment:', error);
        }
    };

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId]);

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
        navigate(`/eval/selected/${assignmentId}`);
    };

    const handlePublishToggle = async () => {
        try {
            const response = await axios.put(`http://localhost:5173/eval-api/assignments/${assignmentId}/${isPublished ? 'unpublish' : 'publish'}`, {}, {
                withCredentials: true
            });
            if (response.status === 200) {
                // Fetch the latest state from the database after toggling
                fetchAssignment();
                console.log(`Assignment ${isPublished ? 'unpublished' : 'published'} successfully`);
            } else {
                console.error(`Failed to ${isPublished ? 'unpublish' : 'publish'} assignment:`, response);
            }
        } catch (error) {
            console.error(`Error ${isPublished ? 'unpublishing' : 'publishing'} assignment:`, error);
        }
    };

    const handleSubmitChanges = async () => {
        try {
            await axios.put(`http://localhost:5173/eval-api/assignments/${assignmentId}`, {
                assignmentName: title,
                dueDate: deadline,
                criteria: rubricContent
            }, {
                withCredentials: true
            });
            setIsEdited(false);
            console.log('Assignment updated successfully');
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <div className="filler-div">
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
                    
                                <button className="assignment-button" onClick={handleViewSubmissions}>
                                    View Submissions
                                </button>
                                <button className="assignment-button" onClick={handlePublishToggle}>
                                    {isPublished ? 'Unpublish Assignment' : 'Publish Assignment'}
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
                                <button className="assignment-button2" onClick={handleSubmitChanges}>
                                    Submit Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublishAssignment;
