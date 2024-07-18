const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { log } = require('console');
const router = express.Router();

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

// OpenAI Assistant, Thread, and Message creation endpoint
router.post('/gpt/assistants', async (req, res) => {
    const { promptText } = req.body;
    log(`Received promptText: ${promptText}`);

    try {
        // Step 1: Create the assistant
        // Professor's prompt is used as the instruction for the assistant
        const assistantResponse = await axios.post('https://api.openai.com/v1/assistants', {
            instructions: promptText, // Using the prompt text as the instruction
            name: "Grading Assistant",
            tools: [{ type: "code_interpreter" }],
            model: 'gpt-4o-mini',
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        const assistant = assistantResponse.data;
        log(`Assistant created: ${JSON.stringify(assistant)}`);

        // Step 2: Create the thread
        const threadResponse = await axios.post('https://api.openai.com/v1/threads', {}, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        const thread = threadResponse.data;
        log(`Thread created: ${JSON.stringify(thread)}`);

        // Step 3: Send a message to the created thread
        // This is where we put in the default prompt for the assistant
        // Edit the "content" to change the default prompt
        const messageResponse = await axios.post(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
            role: "user",
            content: "Grade the student assignments."
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        log(`Message sent to thread: ${JSON.stringify(messageResponse.data)}`);

        // Step 4: Run the assistant to process the thread
        const runResponse = await axios.post(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
            assistant_id: assistant.id,
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        log(`Run created: ${JSON.stringify(runResponse.data)}`);

        // Step 5: Wait for the assistant to generate a response
        let response = await axios.get(`https://api.openai.com/v1/threads/${thread.id}/runs/${runResponse.data.id}`, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        while (response.data.status === "in_progress" || response.data.status === "queued") {
            log("Waiting for assistant's response...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds
            response = await axios.get(`https://api.openai.com/v1/threads/${thread.id}/runs/${runResponse.data.id}`, {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            });
        }

        // Step 6: Retrieve and return the assistant's response
        const threadMessagesResponse = await axios.get(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        const messages = threadMessagesResponse.data.data;
        log(`Messages received: ${JSON.stringify(messages)}`);
        const latestAssistantMessage = messages.filter(message => message.role === 'assistant').pop();

        if (latestAssistantMessage) {
            log(`Assistant's response received: ${JSON.stringify(latestAssistantMessage.content)}`);
            res.json({ response: latestAssistantMessage.content });
        } else {
            res.status(500).json({ error: 'Failed to get assistant response' });
        }
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