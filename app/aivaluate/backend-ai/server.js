const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { log } = require('console');

const app = express();
app.use(bodyParser.json());

app.post('/ai-api/api/gpt', async (req, res) => {
  const { prompt } = req.body;
  log(`Received prompt: ${prompt}`);

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: prompt,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to communicate with AI model' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
