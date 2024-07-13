const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/api/llama', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(`${process.env.OLLAMA_URL}/api/llama`, { prompt });
    res.json({ response: response.data });
  } catch (error) {
    console.error('Error communicating with AI model:', error);
    res.status(500).json({ error: 'Failed to communicate with AI model' });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export app for testing
