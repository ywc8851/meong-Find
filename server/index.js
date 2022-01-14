const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const { auth, blockLoginUser } = require('./auth.js');
const { users, posts, comments } = require('./db');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const config = require('../webpack.config.js');
const compiler = webpack(config);
const nodemailer = require('nodemailer');

app.use(webpackDevMiddleware(compiler));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const createToken = (email, expirePeriod) => jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: expirePeriod });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'meongfind@gmail.com',
    pass: 'meongfind123!',
  },
});

const emailOptions = {
  from: 'meongfind@gmail.com',
  to: '',
  subject: '임시 비밀번호 안내 입니다.',
  html: '',
};

const urls = ['/signin', '/signup', '/mypage', '/mypageEdit', '/detail'];

const devServer = (req, res, next) => {
  if (req.url.split('/').length >= 3) {
    req.url = `/${req.url.split('/')[1]}`;
  }
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

// 루트페이지(메인페이지)
app.get('/', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// 모든 게시물 가져오기
app.get('/getposts', (req, res) => {
  res.send(posts.get());
});

// select 3개로 쿼리문을 날려서 게시물 가져오기
app.get('/findposts/:city/:district/:species', (req, res) => {
  const { city, district, species } = req.params;
  const filterPosts = posts.filter({ city, district, animal: species });
  res.send(filterPosts);
});

// 마이페이지
app.get('/mypage', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mypage.html'));
});

// 수정페이지
app.get('/mypageEdit', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mypageEdit.html'));
});

// 마이페이지 정보
app.get('/profile', (req, res) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    // throw new Error();
    res.send(users.filter({ email: decoded.email }));
  } catch (e) {
    console.log('error');
    return res.redirect('/signin');
  }
});

// 내가 작성한 글
app.get('/mypost/:writerNickname', (req, res) => {
  const { writerNickname } = req.params;
  try {
    console.log(posts.filter({ writerNickname }));
    res.send(posts.filter({ writerNickname }));
  } catch (e) {
    console.log('error');
  }
});

// 프로필 정보 수정
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  // const payload = { ...req.body };
  // users = users.map(user => (user.id === id ? { ...user, ...payload } : user));
  const user = users.update(id, req.body);
  console.log(user);
  res.send(users);
});

app.get(urls, blockLoginUser, devServer, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
});

// 메인페이지 -> 상세페이지로 이동
app.get('/detail/:id', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html/detail.html`));
});

app.get('/post/:id', (req, res) => {
  const { id } = req.params;
  const postInfo = posts.filter({ id: id });
  res.send(postInfo);
});

// app.get('/post/user/:id', (req, res) => {
//   const { id } = req.params;
//   const userInfo = users.filter({ id: id });
//   res.send(userInfo);
// });

// 상세페이지 comment 가져오기
app.get('/post/comments/:id', (req, res) => {
  const { id: id } = req.params;
  const commentList = JSON.parse(id);
  const list = commentList.map(commentId => comments.filter({ id: commentId }));
  res.send(list);
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
    return res.status(401).send('등록되지 않은 사용자입니다.');
  }

  const accessToken = createToken(email, autoLogin ? '1d' : '1d');

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
  res.clearCookie('accessToken').redirect('/');
});

// 아이디 확인
app.get('/user/id/:email', (req, res) => {
  const { email } = req.params;
  const [user] = users.filter({ email });

  res.send({
    id: user.id,
  });
});

// 임시 비밀번호 발급
app.patch('/user/temporary', (req, res) => {
  const { id, password } = req.body;
  const changeCheck = users.update(id, { password });

  if (!changeCheck) {
    return res.status(401).send('임시비밀번호 변경에 실패 했습니다.');
  }
  emailOptions.to = changeCheck.email;
  emailOptions.html = `<h2>임시 비밀번호 안내 입니다.</h2>
  <p> 안녕하세요  찾아줄개 입니다~^^ 고객님의 임시 비밀번호입니다.</p>
  <p>비밀번호:${changeCheck.password}</p>`;

  transporter.sendMail(emailOptions);

  res.send({
    changeCheck,
  });
});

app.get('/user/login', auth);

app.get('*', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
