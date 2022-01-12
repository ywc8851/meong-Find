const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const auth = require('./auth.js');
const { users } = require('./db');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const config = require('../webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const urls = ['/signin', '/signup'];

const devServer = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const file = path.join(config.output.path, `${urls.includes(req.url) ? `html${req.url}` : '/index'}.html`);
    compiler.outputFileSystem.readFile(file, (err, result) => {
      if (err) {
        res.sendStatus(404);
        return;
      }
      res.set('content-type', 'text/html').end(result);
    });
  } else next();
};

app.get(urls, devServer, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
});

// 메인페이지
app.get('/mainpage', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mainpage.html'));
  console.log(posts);
  res.send(posts);
});

// 닉네임 중복검사
app.get('/user/name/:nickname', (req, res) => {
  const { nickname } = req.params;
  const [user] = users.filter({ nickname });
  const nicknameDuplicate = !!user;
  res.send({
    nicknameDuplicate,
  });
});

// 이메일 중복검사
app.get('/user/email/:email', (req, res) => {
  const { email } = req.params;
  const [user] = users.filter({ email });
  const emailDuplicate = !!user;
  res.send({
    emailDuplicate,
  });
});

// 회원가입
app.post('/users/signup', (req, res) => {
  const user = users.create({ ...req.body });
  res.send(user);
});

app.get('*', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// app.post('/user/signin', (req, res) => {
//   const {email, password } = req.body;

//   if(!email) {
//     res.status(401).send('email이 전달되지 않았습니다.')
//   }

//   if(!password) {
//     res.status(401).send('password가 전달되지 않았습니다.')
//   }

// })

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
