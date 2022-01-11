const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const auth = require('./auth.js');
const { signIn } = require('./templates');
let { users } = require('./database');

console.log(users);
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

app.get('/user/name/:nickname', (req, res) => {
  const { nickname } = req.params;
  const user = users.find(user => user.nickname === nickname);
  const nicknameDuplicate = !!user;

  res.send({
    nicknameDuplicate,
  });
});
app.get('/user/email/:email', (req, res) => {
  const { email } = req.params;
  const user = users.find(user => user.email === email);
  console.log(email);
  const emailDuplicate = !!user;
  res.send({
    emailDuplicate,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
