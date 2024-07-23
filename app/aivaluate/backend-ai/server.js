const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const aiRoutes = require('./aiRoutes');

const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use('/ai-api', aiRoutes);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;