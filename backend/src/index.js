const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const upload = require('./upload');
const bcrypt = require('bcrypt');

const { auth, blockLoginUser, kakaoLogin } = require('./auth.js');
const { users, posts, comments } = require('../db');

const { emailOptions, transporter } = require('./mail.js');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.use(express.static('../public'));
app.use(express.json());
app.use(cookieParser());

const createToken = (email, expirePeriod) =>
  jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: expirePeriod });

const urls = ['/signin', '/signup', '/detail', '/mypage', '/mypageEdit'];

const getCommentsByPostId = lists =>
  lists.map(list => {
    const [{ nickname }] = users.filter({ id: list.writerId });
    return { ...list, writerNickname: nickname };
  });

// 루트페이지(메인페이지)
app.get('/', (req, res) => {
  console.log('root');
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 검색 title
app.get('/search/:title', (req, res) => {
  const { title } = req.params;
  const searchPosts = posts.search({ title });
  res.send(searchPosts);
});

// 뒤로가기 페이지 가져오기
app.get('/preposts/:page', (req, res) => {
  const { page } = req.params;
  res.send(posts.pageReloadFilter({ page }));
});

// 지정된 게시물의 페이지 가져오기
app.get('/getposts/:page', (req, res) => {
  const { page } = req.params;
  res.send(posts.pageFilter({ page }));
});

// 모든 게시물 가져오기
app.get('/getposts', (req, res) => {
  res.send(posts.get());
});

// 지정된 게시물의 페이지 가져오기
app.get('/getposts/:page', (req, res) => {
  const { page } = req.params;
  console.log(page);
  res.send(posts.pageFilter({ page }));
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
  res.sendFile(path.join(__dirname, `../public/html/register.html`));
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
  req.body.user.password = bcrypt.hashSync(req.body.user.password, 10);
  try {
    users.update(id, req.body.user);
    res.send();
  } catch (e) {
    console.error(e);
  }
});

app.post('/post', (req, res) => {
  try {
    const newPost = req.body;
    const post = posts.create({ ...newPost, comments: [] });
    res.send(post);
  } catch (error) {
    console.error(error);
    res.redirect('back');
  }
});

app.get('/update/:id', (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html/register.html`));
});

app.put('/update', (req, res) => {
  const { body } = req;
  const updatedPost = posts.update(body.id, body);
  res.send(updatedPost);
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
    const listsAddedWriter = getCommentsByPostId(lists);

    res.send(listsAddedWriter);
  } catch (e) {
    console.error(e);
  }
});

// urls 배열에 있는 client 에게 전송
app.get(urls, blockLoginUser, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/html${req.url}.html`));
});

// 상세페이지 comment 달기
app.post('/comment', (req, res) => {
  const { postId } = req.body;

  try {
    // const id = `comment${comments.get().length + 1}`;
    const comment = comments.createBack(req.body);

    // post에 comments 정보 추가
    const [post] = posts.filter({ id: postId });
    posts.update(postId, { comments: [...post.comments, comment.id] });

    const lists = comments.filter({ postId });
    const listsAddedWriter = getCommentsByPostId(lists);

    res.send(listsAddedWriter);
  } catch (error) {
    console.error(error);
  }
});

// 상세페이지 comment 수정
app.patch('/post/comment', (req, res) => {
  const { id, content } = req.body;
  try {
    comments.update(id, { content });
    res.send();
  } catch (error) {
    console.error(error);
  }
});

// 상세페이지 comment 삭제
app.delete('/post/comment/:postId/:commentId', (req, res) => {
  const { postId, commentId } = req.params;

  try {
    comments.delete(commentId);

    const [post] = posts.filter({ id: postId });
    const deletedComments = post.comments.filter(
      comment => comment !== commentId
    );
    posts.update(postId, { comments: deletedComments });

    const lists = comments.filter({ postId });
    const listsAddedWriter = getCommentsByPostId(lists);

    res.send(listsAddedWriter);
  } catch (error) {
    console.error(error);
  }
});

app.delete('/post/:id', (req, res) => {
  const { id } = req.params;

  try {
    posts.delete(id);

    // post id에 따른 comment 삭제
    comments.filter({ postId: id }).map(comment => comments.delete(comment.id));
    res.send();
  } catch (error) {
    console.error(error);
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
    const user = users.create({
      ...req.body.user,
      password: bcrypt.hashSync(req.body.user.password, 10),
      isValid: true,
    });
    res.send(user);
  } catch (e) {
    console.error(e);
  }
});

//로그인
app.post('/user/login', (req, res) => {
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

app.get('/user/logout/oauth/kakao', (req, res) => {
  res.clearCookie('accessToken').clearCookie('kakaoAccessToken').redirect('/');
});

//로그아웃
app.post('/user/logout', (req, res) => {
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
  users.update(id, { password: bcrypt.hashSync(password, 10) });
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

app.get('/user/login/restapikey/kakao', (req, res) => {
  res.send(process.env.KAKAO_REST_API_KEY);
});

app.get('/user/login/oauth/kakao', kakaoLogin, (req, res) => {
  const { email } = req.user;
  const { access_token, expires_in } = req.access_token;
  const accessToken = createToken(email, '1d');

  res
    .cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    })
    .cookie('kakaoAccessToken', access_token, {
      maxAge: expires_in,
      httpOnly: true,
    })
    .redirect('/');
});

// 존재하는 페이지가 아니라면 , 404 뜨게하세요.
app.get('*', (req, res) => {
  console.log('???');
  res.sendFile(path.join(__dirname, '../public/html/404.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
