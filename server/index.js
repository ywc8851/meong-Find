const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const upload = require('./upload');
const bcrypt = require('bcrypt');

const { auth, blockLoginUser } = require('./auth.js');
const { users, posts, comments } = require('./db');

const { emailOptions, transporter } = require('./mail.js');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const createToken = (email, expirePeriod) => jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: expirePeriod });

const urls = ['/signin', '/signup', '/detail', '/mypage', '/mypageEdit'];

// 루트페이지(메인페이지)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// 검색 title
app.get('/search/:title', (req, res) => {
  const { title } = req.params;
  console.log(title);
  const searchPosts = posts.filter({ title });
  res.send(searchPosts);
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
app.get('/mypage', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/mypage.html'));
});

// 수정페이지
app.get('/mypageEdit', auth, (req, res) => {
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

app.get('/register', auth, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
});

// 내가 작성한 글
app.get('/mypost/:writerId', (req, res) => {
  const { writerId } = req.params;
  try {
    const post = posts.filter({ writerId });
    res.send(post);
  } catch (e) {
    console.log('error');
  }
});

// 프로필 정보 수정
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  req.body.password = bcrypt.hashSync(req.body.password, 10);

  try {
    users.update(id, req.body);
    res.send();
  } catch (e) {
    console.error(e);
  }
});

app.post('/post', (req, res) => {
  try {
    const newPost = req.body;
    const post = posts.create({ id: 'adsff', ...newPost });
    res.send({ post });
  } catch (error) {
    console.error(error);
    res.redirect('back');
  }
});

// 메인페이지 -> 상세페이지로 이동
app.get('/post/:id', (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html/detail.html`));
});

// 상세페이지 posting 정보 가져오기
app.get('/detail/:id', (req, res) => {
  const { id } = req.params;

  try {
    const [postInfo] = posts.filter({ id });
    const [writerInfo] = users.filter({ id: postInfo.writerId });

    // postInfo.writer = writerInfo.nickname;
    res.send({ ...postInfo, writer: writerInfo.nickname });
  } catch (error) {
    console.error(error);
  }
});

// 상세페이지 comment 가져오기
app.get('/comments/:idList', (req, res) => {
  const { idList: id } = req.params;
  const commentList = JSON.parse(id);

  try {
    const lists = commentList.map(id => comments.filter({ id })[0]);
    const listsAddedWriter = [];
    lists.map(list => {
      let [user] = users.filter({ id: list.writerId });
      listsAddedWriter[listsAddedWriter.length] = { ...list, writerNickname: user.nickname };
    });

    res.send(listsAddedWriter);
  } catch (e) {
    console.error(e);
  }
});

// urls 배열에 있는 client 에게 전송
app.get(urls, blockLoginUser, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
});

// 상세페이지 comment
app.post('/comment', (req, res) => {
  const { postId } = req.body;

  try {
    const id = `comment${comments.get().length + 1}`;
    comments.createBack({ id, ...req.body });

    // post에 comments 정보 추가
    const [post] = posts.filter({ id: postId });
    const comment = [...post.comments, id];
    posts.update(postId, { comments: comment });

    res.send({ id, ...req.body });
  } catch (error) {
    console.error(error);
  }
});

// urls 배열에 있는 client 에게 전송
app.get(urls, blockLoginUser, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
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

  try {
    const [user] = users.filter({ email });
    const emailDuplication = !!user;
    res.send({
      emailDuplication,
    });
  } catch (e) {
    console.error(e);
  }
});

// 회원가입
app.post('/users/signup', (req, res) => {
  try {
    const user = users.create({ ...req.body, password: bcrypt.hashSync(req.body.password, 10), isValid: true });
    // console.log(user);
    res.send(user);
  } catch (e) {
    console.error(e);
  }
});

//로그인
app.post('/user/signin', (req, res) => {
  const { email, password, autoLogin } = req.body;
  const [user] = users.filter({ email, isValid: true });
  let iscorrectPwd;
  if (!user) {
    return res.status(401).send('등록되지 않은 사용자입니다.');
  } else {
    iscorrectPwd = bcrypt.compareSync(password, user.password);
  }
  if (!iscorrectPwd) {
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

// 회원탈퇴를 위해 비밀번호 확인

// 회원탈퇴
app.post('/users/delete/:id', (req, res) => {
  const { id } = req.params;
  const [user] = users.filter({ id, isValid: true });

  const iscorrectPwd = bcrypt.compareSync(req.body.password, user.password);
  if (!iscorrectPwd) {
    return res.status(401).send('비밀번호가 일치하지 않습니다.');
  } else {
    users.update(id, { isValid: false });
    res.clearCookie('accessToken').sendStatus(204);
    res.send();
  }
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
  const updatedUser = users.update(id, { password: bcrypt.hashSync(password, 10) });

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

app.get('/user/login', auth, (req, res) => {
  const { email } = req;
  const [user] = users.filter({ email });
  res.send({ user });
});

app.post('/upload', upload.array('img', 4), (req, res) => {
  console.log('UPLOAD SUCCESS!', req.files);
  res.json({ success: true, files: req.files });
});

// 존재하는 페이지가 아니라면 , 404 뜨게하세요.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
