import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../EditRubric.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EditRubric = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming the route contains an id parameter for the rubric
    const [title, setTitle] = useState("");
    const [rubricContent, setRubricContent] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [isMarkdownView, setIsMarkdownView] = useState(true);

    useEffect(() => {
        fetchRubric();
    }, []);

    const fetchRubric = async () => {
        try {
            const response = await axios.get(`http://localhost:5173/eval-api/rubrics/${id}`);
            setTitle(response.data.title);
            setRubricContent(response.data.criteria);
        } catch (error) {
            console.error('Error fetching rubric:', error);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsEdited(true);
    };

    const handleContentChange = (e) => {
        setRubricContent(e.target.value);
        setIsEdited(true);
    };

    const saveRubric = async () => {
        try {
            await axios.put(`http://localhost:5173/eval-api/rubrics/${id}`, {
                title,
                criteria: rubricContent,
            });
            setIsEdited(false);
            navigate(-1); // Navigate back after saving
        } catch (error) {
            console.error('Error saving rubric:', error);
        }
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText="Course number - Course Name" />
            <SideMenuBarEval tab="rubrics"/>
            <div className="rubric-container rborder secondary-colorbg">
                <div className="line-up-title">
                    <button className="back-button02" onClick={() => navigate(-1)}>
                        <CircumIcon name="circle_chev_left" className="icon-size" />
                    </button>
                    <input 
                        type="text" 
                        className="title-input primary-color-text" 
                        value={title} 
                        onChange={handleTitleChange} 
                    /> 
                    <h3 className="edit-text">Click to edit</h3>
                </div>
                <div className="line-main-text">
                    {isMarkdownView ? (
                        <div onClick={() => setIsMarkdownView(false)}>
                            <ReactMarkdown>{rubricContent}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            className="rubric-textarea"
                            value={rubricContent}
                            onChange={handleContentChange}
                            onBlur={() => setIsMarkdownView(true)}
                        />
                    )}
                    <h3 className="edit-text-2">Click to edit</h3>
                </div>
                <div className="bottom-bar">
                    <div className="empty-space"></div>
                    <button 
                        className={`confirm-button ${isEdited ? 'secondary-button' : 'disabled-button'} rborder`} 
                        disabled={!isEdited}
                        onClick={saveRubric}
                    >
                        CLICK TO CONFIRM CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRubric;