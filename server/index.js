const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const auth = require('./auth.js');
const { users, posts } = require('./db');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const config = require('../webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const createToken = (email, expirePeriod) => jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: expirePeriod });

const urls = ['/', '/signin', '/signup', '/mainpage'];

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
});

// 루트페이지(메인페이지)
app.get('/', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mainpage.html'));
});

// 모든 게시물 가져오기
app.get('/getposts', (req, res) => {
  res.send(posts.get());
});

// select 3개로 쿼리문을 날려서 게시물 가져오기
app.get('/findposts/:city/:district/:species', (req, res) => {
  const { city, district, species } = req.params;
  const filterPosts = posts.filter({ city, district, animal: species });
  console.log(filterPosts);
  res.send(filterPosts);
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

//로그인
app.post('/user/signin', (req, res) => {
  const { email, password, autoLogin } = req.body;
  const [user] = users.filter({ email, password });
  if (!user) {
    console.log(user);
    return res.status(401).send(
      '등록되지 않은 사용자입니다.'
      // error: '등록되지 않은 사용자입니다.',
    );
  }
  const accessToken = createToken(email, autoLogin ? '30s' : '10s');

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  res.send({
    id: user.id,
  });
});

//로그아웃
app.get('/user/signout', (req, res) => {
  res.clearCookie('accessToken').redirect('/mainpage');
});

app.get('*', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
