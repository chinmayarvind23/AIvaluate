import axios from 'axios';
import React, { useState, useEffect } from 'react';

const AITest = () => {
  const [AIResponse, setAIResponse] = useState('');
  const [input, setInput] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [promptText, setPromptText] = useState('');

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

  useEffect(() => {
    const fetchPromptData = async () => {
      if (instructorId) { // Ensure instructorId is set
        try {
          const response = await axios.get(`http://localhost:5173/eval-api/prompt/${instructorId}`, {
            withCredentials: true
          });
          if (response.data.promptId) {
            setPromptText(response.data.promptText || '');
          } else {
            setPromptText('No Prompt Selected');
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Handle 404 error gracefully
            setPromptText('No Prompt Selected');
          } else {
            console.error('There was an error fetching the prompt data:', error);
          }
        }
      }
    };
    fetchPromptData();
  }, [instructorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAIResponse('Typing...');

    console.log("Submitting with promptText:", promptText);

    try {
      const response = await axios.post(`http://localhost:5173/ai-api/gpt/assistants`, { 
        promptText
      });
      console.log("Response from server:", response.data);
      setAIResponse(`Assistant's feedback: ${response.data.response.map(msg => msg.text.value).join('\n')}`);
    } catch (error) {
      console.error('Error communicating with AI backend:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      setAIResponse('Error communicating with AI backend');
    }
  };

  return (
    <div>
      <div>
        <h1>Current Prompt Text</h1>
        <p>{promptText}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="update-ai">Submit</button>
      </form>
      <div>
        <h1>AI Response</h1>
        <p>{AIResponse}</p>
      </div>
    </div>
  );
};

export default AITest;
