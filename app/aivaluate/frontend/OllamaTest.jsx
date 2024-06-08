import axios from 'axios';
import React, { useState } from 'react';

const OllamaTest = () => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [modelInput, setModelInput] = useState('');

  const handleInputChange = (e) => {
    setModelInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');
    
    try {
      const res = await axios.post('http://localhost:11434/run', {
        model: 'llama2',  // Replace with the model you want to run
        input: modelInput
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Test Ollama Service</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={modelInput}
          onChange={handleInputChange}
          placeholder="Enter input for the model"
        />
        <button type="submit">Run Model</button>
      </form>
      {response && <div><h2>Response:</h2><pre>{JSON.stringify(response, null, 2)}</pre></div>}
      {error && <div><h2>Error:</h2><pre>{error}</pre></div>}
    </div>
  );
};

export default OllamaTest;
