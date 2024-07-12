import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import '../AISettings.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';

const AISettings = () => {
    const [answerType, setAnswerType] = useState('');
    const [detailLevel, setDetailLevel] = useState('');
    const [promptText, setPromptText] = useState('');

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

                    {/* If you want to see if you can make this display properly go for it. Otherwise delete them I've tried for too long.                 */}
                    
                    
                    {/* <h2>Grading Analytics</h2>
                    <form className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="point-form"
                                name="answerType"
                                value="point-form"
                                checked={answerType === 'point-form'}
                                onChange={handleAnswerTypeChange}
                            />
                            <label htmlFor="point-form">Point form</label>
                        </div>

                        <div className="radio-item">
                            <input
                                type="radio"
                                id="short-answer"
                                name="answerType"
                                value="short-answer"
                                checked={answerType === 'short-answer'}
                                onChange={handleAnswerTypeChange}
                            />
                            <label htmlFor="short-answer">Short answer</label>
                        </div>

                        <div className="radio-item">
                            <input
                                type="radio"
                                id="in-depth-explanation"
                                name="answerType"
                                value="in-depth-explanation"
                                checked={answerType === 'in-depth-explanation'}
                                onChange={handleAnswerTypeChange}
                            />
                            <label htmlFor="in-depth-explanation">In-depth explanation</label>
                        </div>
                    </form>

                    <h2>General</h2>
                    <form className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="low-level"
                                name="detailLevel"
                                value="low-level"
                                checked={detailLevel === 'low-level'}
                                onChange={handleDetailLevelChange}
                            />
                            <label htmlFor="low-level">Low level</label>
                        </div>

                        <div className="radio-item">
                            <input
                                type="radio"
                                id="general"
                                name="detailLevel"
                                value="general"
                                checked={detailLevel === 'general'}
                                onChange={handleDetailLevelChange}
                            />
                            <label htmlFor="general">General</label>
                        </div>

                        <div className="radio-item">
                            <input
                                type="radio"
                                id="advanced"
                                name="detailLevel"
                                value="advanced"
                                checked={detailLevel === 'advanced'}
                                onChange={handleDetailLevelChange}
                            />
                            <label htmlFor="advanced">Advanced</label>
                        </div>
                    </form> */}
                    <button type="submit" className="update-ai"><CircumIcon name="coffee_cup"/>Retrain AI</button>
                </div>
            </div>
        </div>
    );
};

export default AISettings;
