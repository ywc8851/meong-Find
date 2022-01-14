const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const { auth, blockLoginUser } = require('./auth.js');
const { users, posts, comments } = require('./db');

const { emailOptions, transporter } = require('./mail.js');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const config = require('../webpack.config.js');
const compiler = webpack(config);
// const nodemailer = require('nodemailer');

app.use(webpackDevMiddleware(compiler));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const createToken = (email, expirePeriod) => jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: expirePeriod });

const urls = ['/signin', '/signup', '/detail', '/mypage', '/mypageEdit'];

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
app.get('/findposts/:city/:district/:animal', (req, res) => {
  const { city, district, animal } = req.params;
  const filterPosts = posts.filter({ city, district, animal });
  res.send(filterPosts);
});

// 마이페이지
app.get('/mypage', auth, devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mypage.html'));
});

// 수정페이지
app.get('/mypageEdit', auth, devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mypageEdit.html'));
});

// 마이페이지 정보
app.get('/profile', (req, res) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    res.send(users.filter({ email: decoded.email }));
  } catch (e) {
    return res.redirect('/signin');
  }
});

// 내가 작성한 글
app.get('/mypost/:writerNickname', (req, res) => {
  const { writerNickname } = req.params;

  try {
    const post = posts.filter({ writerNickname });
    res.send(post);
  } catch (e) {
    console.log('error');
  }
});

// 프로필 정보 수정
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;

  try {
    users.update(id, req.body);
    res.send();
  } catch (e) {
    console.error(e);
  }
});

// 메인페이지 -> 상세페이지로 이동
app.get('/post/:id', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html/detail.html`));
});

app.get('/detail/:id', (req, res) => {
  const { id } = req.params;

  try {
    const postInfo = posts.filter({ id });
    res.send(postInfo);
  } catch (e) {
    console.error(e);
  }
});

// 상세페이지 comment 가져오기
app.get('/comments/:idList', (req, res) => {
  const { idList: id } = req.params;
  const commentList = JSON.parse(id);

  try {
    const list = commentList.map(id => comments.filter({ id })[0]);
    res.send(list);
  } catch (e) {
    console.error(e);
  }
});

// urls 배열에 있는 client 에게 전송
app.get(urls, blockLoginUser, devServer, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
});

// 회원가입
app.post('/users/signup', (req, res) => {
  try {
    const user = users.create({ ...req.body });
    res.send(user);
  } catch (e) {
    console.error(e);
  }
});

// 닉네임 중복검사
app.get('/user/name/:nickname', (req, res) => {
  const { nickname } = req.params;
  try {
    const [user] = users.filter({ nickname });
    const nicknameDuplication = !!user;
    res.send({
      nicknameDuplication,
    });
  } catch (e) {
    console.log(e);
  }
});

// 이메일 중복검사
app.get('/user/email/:email', (req, res) => {
  const { email } = req.params;

  // 바꿔라 duplicate -> duplication
  try {
    const [user] = users.filter({ email });
    const emailDuplicate = !!user;
    res.send({
      emailDuplicate,
    });
  } catch (e) {
    console.error(e);
  }
});

//로그인
app.post('/user/signin', (req, res) => {
  const { email, password, autoLogin } = req.body;
  const [user] = users.filter({ email, password, isValid: true });

  if (!user) {
    return res.status(401).send('등록되지 않은 사용자입니다.');
  }

  const accessToken = createToken(email, autoLogin ? '1d' : '1d');

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  res.send();
});

//로그아웃
app.get('/user/signout', (req, res) => {
  res.clearCookie('accessToken').redirect('/');
});

// 존재하는 이메일인지 확인
app.get('/user/id/:email', (req, res) => {
  const { email } = req.params;
  const [user] = users.filter({ email, isValid: true });

  res.send({
    id: user.id,
  });
});

// 임시 비밀번호 발급
app.patch('/user/temporary', (req, res) => {
  const { id, password } = req.body;
  const updatedUser = users.update(id, { password });

  if (!updatedUser) {
    return res.status(401).send('임시비밀번호 변경에 실패 했습니다.');
  }

  emailOptions.to = updatedUser.email;
  emailOptions.html = `
  <h2>임시 비밀번호 안내 입니다.</h2>
  <p> 안녕하세요  찾아줄개 입니다~^^ 고객님의 임시 비밀번호입니다.</p>
  <p>비밀번호:${updatedUser.password}</p>`;

  transporter.sendMail(emailOptions);

  res.send();
});

app.get('/user/login', auth);

// 존재하는 페이지가 아니라면 , 404 뜨게하세요.
app.get('*', devServer, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
