import axios from 'axios';

export const fetchHtml = async url => {
  // console.log(`/${url === '/' ? 'index' : `html/${url}`}.html`);
  try {
    return await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};

export const getSignUpForm = async () => {
  return await axios.get('/signup');
};

export const getSignUpEmail = async emailValue => {
  return await axios.get(`/user/email/${emailValue}`);
};

export const getSignUpName = async nickname => {
  return await axios.get(`/user/name/${nickname}`);
};

export const getMainPosts = async () => {
  return await axios.get('/mainpage');
};

// 회원가입 정보 전송
export const getSignup = async (nickname, email, password, city, district) => {
  return await axios.post('/users/signup', {
    nickname,
    email,
    password,
    city,
    district,
  });
};
