const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const auth = require('./auth.js');
const { signIn } = require('./templates');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/signin', (req, res) => {
  console.log('signin');
  res.send(signIn);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
