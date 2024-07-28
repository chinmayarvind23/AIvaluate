const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { log } = require('console');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

router.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;

// OpenAI Completions endpoint
router.post('/gpt/completions', async (req, res) => {
    const { prompt } = req.body;
    log(`Received prompt: ${prompt}`);
  
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });
  
      res.json({ response: response.data.choices[0].message.content.trim() });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data: ${JSON.stringify(error.response.data)}`);
        res.status(error.response.status).json({ error: error.response.data });
      } else {
        res.status(500).json({ error: 'Failed to communicate with AI model' });
      }
    }
});

module.exports = router;