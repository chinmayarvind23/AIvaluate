const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { log } = require('console');

const aiRoutes = require('./aiRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/ai-api', aiRoutes);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
