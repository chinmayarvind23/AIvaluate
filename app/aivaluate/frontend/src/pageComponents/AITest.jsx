import axios from 'axios';
import React, { useState } from 'react';

const AITest = () => {
  const [AIResponse, setAIResponse] = useState('');
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAIResponse('Typing...');

    try {
      const response = await axios.post(`http://localhost:5173/ai-api/api/gpt`, { prompt: input });
      setAIResponse(response.data.response);
    } catch (error) {
      console.error('Error communicating with AI backend:', error);
      setAIResponse('Error communicating with AI backend');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="AI-input"
          placeholder="Type your AI text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
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
