const axios = require('axios');

describe('Ollama Service', () => {
  test('should run llama3 model with input and return a response', async () => {
    const input = 'Test input for the model';

    try {
      const response = await axios.post('http://localhost:11434/run', {
        model: 'llama3',
        input: input
      });

      console.log('Response:', response.data);

      // Example assertions - adjust based on the actual response structure
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data).toHaveProperty('output');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });

  test('should return an error for invalid input', async () => {
    try {
      const input = ''; // Empty input to simulate an error

      await axios.post('http://localhost:11434/run', {
        model: 'llama3',
        input: input
      });
    } catch (error) {
      console.log('Error Response:', error.response.data);
      
      expect(error.response.status).toBe(400); // Assuming the service returns 400 for bad requests
      expect(error.response.data).toBeDefined();
      expect(error.response.data).toHaveProperty('error');
    }
  });
});
