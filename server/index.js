const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const auth = require('./auth.js');
let { users } = require('./database');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const config = require('../webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const devServer = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const file = path.join(config.output.path, `html/${req.url.slice(1)}.html`);
    compiler.outputFileSystem.readFile(file, (err, result) => {
      if (err) {
        res.sendStatus(404);
        return;
      }
      res.set('content-type', 'text/html').end(result);
    });
  } else next();
};

app.get('/signin', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/signin.html'));
});

app.get('/signup', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

// 닉네임 중복검사
app.get('/user/name/:nickname', (req, res) => {
  const { nickname } = req.params;
  const user = users.find(user => user.nickname === nickname);
  const nicknameDuplicate = !!user;

  res.send({
    nicknameDuplicate,
  });
});

// 이메일 중복검사
app.get('/user/email/:email', (req, res) => {
  const { email } = req.params;
  const user = users.find(user => user.email === email);
  const emailDuplicate = !!user;
  res.send({
    emailDuplicate,
  });
});

// 회원가입
app.post('/users/signup', (req, res) => {
  users = [...users, { ...req.body }];
  console.log(users);
  res.send(users);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
