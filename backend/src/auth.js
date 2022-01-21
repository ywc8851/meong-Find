const jwt = require('jsonwebtoken');
const axios = require('axios');
const uniqid = require('uniqid');
const { users } = require('../db');

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    const { email } = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (!email) {
      return res.clearCookie('accessToken').redirect('back');
    }
    if (req.url === '/user/login') {
      req.email = email;
    }
    next();
  } catch (e) {
    return res.clearCookie('accessToken').redirect('back');
  }
};

const blockLoginUser = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  if (!accessToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (decoded) {
      return res.redirect('back');
    }
    console.log('1111');
    next();
  } catch (error) {
    console.log('222');
    next();
  }
};

const kakaoLogin = async (req, res, next) => {
  const authorizationCode = req.url.split('code=')[1];
  try {
    const {
      data: { access_token, expires_in },
    } = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code: authorizationCode,
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const {
      data: {
        kakao_account: {
          email,
          profile: { nickname },
        },
      },
    } = await axios.post('https://kapi.kakao.com/v2/user/me', null, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const [user] = users.filter({ email, isValid: true });
    req.newUser = !!user;
    req.user = user || users.create({ id: uniqid(), email, nickname, isValid: true, isKakaoUser: true });
    req.access_token = {
      access_token,
      expires_in,
    };
  } catch (error) {
    console.log(error);
    res.send({
      message: '로그인이 되지 않았습니다.\n로그인을 다시 시도해주세요.',
    });
  }
  next();
};

const kakaoLogout = async (req, res, next) => {
  const { isKakaoUser } = req.body;
  const { kakaoLogout } = req;

  if (!isKakaoUser || kakaoLogout) {
    return next();
  }

  const access_token = req.cookies.kakaoAccessToken;

  try {
    const {
      data: { id },
    } = await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!id) {
      res.send({
        message: '로그아웃이 되지 않았습니다.\n로그아웃을 다시 시도해주세요.',
      });
    }
    res.clearCookie('kakaoAccessToken');
  } catch (error) {
    console.error(error);
    res.send({
      message: '로그아웃이 되지 않았습니다.\n로그아웃을 다시 시도해주세요.',
    });
  }
  next();
};

module.exports = {
  auth,
  blockLoginUser,
  kakaoLogin,
  kakaoLogout,
};
