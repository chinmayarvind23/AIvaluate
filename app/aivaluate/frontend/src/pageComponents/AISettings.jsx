import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState, useEffect } from 'react';
import '../AISettings.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import axios from 'axios';

const AISettings = () => {
    const [answerType, setAnswerType] = useState('');
    const [detailLevel, setDetailLevel] = useState('');
    const [promptText, setPromptText] = useState('');
    const [instructorId, setInstructorId] = useState(''); 

    // Fetch instructorId
    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const { data: { instructorId } } = await axios.get('http://localhost:5173/eval-api/instructor/me', {
                    withCredentials: true
                });
                setInstructorId(instructorId);

            } catch (error) {
                console.error('There was an error fetching the instructor data:', error);
            }
        };

        fetchInstructorData();
    }, []);

    console.log(instructorId);

    const promptTextProf = 'Mark assignments in a way the motivates the students to do better. I want every student to feel like their effort was noticed. Focus more on why the student lost mark rather than what they did correctly to score marks.';

    const handleAnswerTypeChange = (event) => {
        setAnswerType(event.target.value);
    };

    const handleDetailLevelChange = (event) => {
        setDetailLevel(event.target.value);
    };

    const handlePromptTextChange = (event) => {
        setPromptText(event.target.value);
    };

    return (
        <div>
            <AIvaluateNavBarEval tab="ai" navBarText="AI Settings" />
            <div className='secondary-colorbg ai-section'>
                <div className="ai-settings-div">
                    <h1>Your prompt AI engineering:</h1> <div className="empty"> </div>
                    <textarea
                        value={promptTextProf}
                        onChange={handlePromptTextChange}
                        placeholder={promptText}
                        rows="4"
                        cols="50"
                        className="ai-settings-textarea"
                    />    
                    <button type="submit" className="update-ai"><CircumIcon name="coffee_cup"/>Retrain AI</button>
                </div>
            </div>
        </div>
    );
};

export default AISettings;
