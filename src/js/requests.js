import axios from 'axios';

export const fetchHtml = async url => {
  // console.log(`/${url === '/' ? 'index' : `html/${url}`}.html`);
  try {
    return await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};

export const getSignUpEmail = async emailValue => {
  return axios.get(`/user/email/${emailValue}`);
};

export const getSignUpName = async nickname => {
  return axios.get(`/user/name/${nickname}`);
};

export const getSignup = async (nickname, email, password) => {
  return axios.post('users/signup', {
    nickname: nickname,
    email: email,
    password: password,
    passwordHint: password.slice(0, 2) + '*'.repeat(password.length - 2),
  });
};
