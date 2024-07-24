import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../EditRubric.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EditRubric = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const { assignmentRubricId } = useParams();
    const [title, setTitle] = useState("");
    const [rubricContent, setRubricContent] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('assignmentRubricId:', assignmentRubricId); // Debug log

        if (!assignmentRubricId) {
            setError('Invalid rubric ID');
            return;
        }

        axios.get(`/eval-api/rubric/${assignmentRubricId}`, { 
            withCredentials: true
        })
        .then(response => {
            console.log('API Response:', response.data); // Debug log

            if (response.data && response.data.length > 0) {
                const rubric = response.data[0]; // Access the first element in the array
                console.log('Fetched Rubric:', rubric); // Debug log
                setTitle(rubric.rubricName);
                setRubricContent(rubric.criteria);
            } else {
                setError('Rubric data not found');
            }
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

        axios.put(`/eval-api/rubric/${assignmentRubricId}`, updatedRubric, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(response => {
            console.log('Success:', response.data);
            setIsEdited(false); // Reset the edit flag
            navigate(-1); // Navigate back after successful update
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
            <AIvaluateNavBarEval navBarText={navBarText} />
            <div className="filler-div">
                <SideMenuBarEval tab="rubrics" />
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
        </div>
    );
};

export default EditRubric;
