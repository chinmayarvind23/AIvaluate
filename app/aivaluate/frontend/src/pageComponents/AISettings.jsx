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
    const [prompts, setPrompts] = useState([]);
    const [selectedPromptId, setSelectedPromptId] = useState('');

    // Fetch instructorId
    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const response = await axios.get('http://localhost:5173/eval-api/instructor/me', {
                    withCredentials: true
                });
                setInstructorId(response.data.instructorId);
            } catch (error) {
                console.error('There was an error fetching the instructor data:', error);
            }
        };

        fetchInstructorData();
    }, []);

    // Fetch all prompts of the instructor
    useEffect(() => {
        const fetchPromptsData = async () => {
            if (instructorId) {
                try {
                    const response = await axios.get(`http://localhost:5173/eval-api/prompts/${instructorId}`, {
                        withCredentials: true
                    });
                    setPrompts(response.data);
                } catch (error) {
                    console.error('There was an error fetching the prompts data:', error);
                }
            }
        };
        fetchPromptsData();
    }, [instructorId]);

    // Fetch current selected prompt of the instructor
    useEffect(() => {
        const fetchPromptData = async () => {
            if (instructorId) { // Ensure instructorId is set
                try {
                    const response = await axios.get(`http://localhost:5173/eval-api/prompt/${instructorId}`, {
                        withCredentials: true
                    });
                    if (response.data.promptId) {
                        setSelectedPromptId(response.data.promptId.toString());
                    }
                    setPromptText(response.data.promptText || response.data || ''); // Handle undefined promptText and the message
                } catch (error) {
                    console.error('There was an error fetching the prompt data:', error);
                }
            }
        };
        fetchPromptData();
    }, [instructorId]);

    const handleAnswerTypeChange = (event) => {
        setAnswerType(event.target.value);
    };

    const handleDetailLevelChange = (event) => {
        setDetailLevel(event.target.value);
    };

    const handlePromptTextChange = (event) => {
        setPromptText(event.target.value);
    };

    const handlePromptSelect = async (event) => {
        const selectedId = event.target.value;

        if (selectedId === 'clear') {
            try {
                await axios.put(`http://localhost:5173/eval-api/prompt/clear/${instructorId}`, {});
                setSelectedPromptId('');
                setPromptText('');
            } catch (error) {
                console.error('There was an error clearing the selected prompt:', error);
            }
        } else {
            const selectedPrompt = prompts.find(prompt => prompt.promptId.toString() === selectedId);
            try {
                await axios.put(`http://localhost:5173/eval-api/prompt/select/${selectedId}`, {
                    instructorId: instructorId
                });
                setSelectedPromptId(selectedId);
                setPromptText(selectedPrompt ? selectedPrompt.promptText : '');
            } catch (error) {
                console.error('There was an error updating the selected prompt:', error);
            }
        }
    };

    const handleEditPrompt = async (promptId) => {
        const prompt = prompts.find(p => p.promptId === promptId);
        const newName = window.prompt("Enter new name for the prompt:", prompt.promptName); // Show current name in prompt window
        if (newName) {
            updatePromptName(promptId, newName);
        }
    };

    const updatePromptName = async (promptId, newName) => {
        try {
            await axios.put(`http://localhost:5173/eval-api/prompt/${promptId}`, {
                promptName: newName
            });
            setPrompts(prompts.map(prompt => 
                prompt.promptId === promptId ? { ...prompt, promptName: newName } : prompt
            ));
        } catch (error) {
            console.error('There was an error updating the prompt name:', error);
        }
    };

    const handleDeletePrompt = async (promptId) => {
        const prompt = prompts.find(p => p.promptId === promptId);
        const confirmDelete = window.confirm(`Are you sure you want to delete the prompt: ${prompt.promptName}?`);
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5173/eval-api/prompt/${promptId}`);
                setPrompts(prompts.filter(prompt => prompt.promptId !== promptId));
            } catch (error) {
                console.error('There was an error deleting the prompt:', error);
            }
        }
    };

    return (
        <div>
            <AIvaluateNavBarEval tab="ai" navBarText="AI Settings" />
            <div className='secondary-colorbg ai-section'>
                <div className="ai-settings-div">
                    <h1>Your prompt AI engineering:</h1>
                    <div className="ai-settings-content">
                        <div className="textarea-button-group">
                            <textarea
                                value={promptText}
                                readOnly
                                placeholder="Enter your prompt here"
                                rows="4"
                                cols="50"
                                className="ai-settings-textarea"
                            />
                            <button type="submit" className="update-ai">
                                <CircumIcon name="coffee_cup" /> Retrain AI
                            </button>
                        </div>
                        <div className="radio-group">
                            {prompts.map(prompt => (
                                <div key={prompt.promptId} className="radio-item">
                                    <label>
                                        <input
                                            type="radio"
                                            value={prompt.promptId}
                                            checked={selectedPromptId === prompt.promptId.toString()}
                                            onChange={handlePromptSelect}
                                        />
                                        {prompt.promptName}
                                    </label>
                                    <div className="icon-buttons">
                                        <button onClick={() => handleEditPrompt(prompt.promptId)}>
                                            <CircumIcon name="edit" />
                                        </button>
                                        <button className="trash-icon" onClick={() => handleDeletePrompt(prompt.promptId)}>
                                            <CircumIcon name="trash" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="radio-item">
                                <label>
                                    <input
                                        type="radio"
                                        value="clear"
                                        checked={selectedPromptId === ''}
                                        onChange={handlePromptSelect}
                                    />
                                    Clear Prompt
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISettings;
