import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CircumIcon from "@klarr-agency/circum-icons-react";
import '../EditRubric.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EditRubric = () => {
    const navigate = useNavigate();
    const { assignmentRubricId } = useParams();
    const [title, setTitle] = useState("");
    const [rubricContent, setRubricContent] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5173/eval-api/rubrics/${assignmentRubricId}`, { 
            credentials: 'include'
        })
        .then(response => {
            setTitle(response.data.rubricName);
            setRubricContent(response.data.criteria);
        })
        .catch(error => {
            console.error('Error fetching rubric:', error);
            setError('An error occurred while fetching the rubric.');
        });
    }, [assignmentRubricId]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsEdited(true);
    };

    const handleContentChange = (e) => {
        setRubricContent(e.target.value);
        setIsEdited(true);
    };

    const handleSaveChanges = () => {
        if (!isEdited) return;
        const updatedRubric = {
            rubricName: title,
            criteria: rubricContent
        };

        axios.put(`http://localhost:5173/eval-api/rubrics/${assignmentRubricId}`, updatedRubric, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            console.log('Success:', response.data);
            setIsEdited(false); // Reset the edit flag
        })
        .catch(error => {
            console.error('Error updating rubric:', error);
            setError('An error occurred while updating the rubric.');
        });
    };

    if (error) {
        return <div>{error}</div>;
    }

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
                        onClick={handleSaveChanges}
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
