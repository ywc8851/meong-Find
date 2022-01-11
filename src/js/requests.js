import axios from 'axios';

export const getSignInTemplate = async () => {
  return await axios.get('/signin');
};

export const getSignUpEmail = async emailValue => {
  return axios.get(`/user/email/${emailValue}`);
};

export const getSignUpName = async nickname => {
  return axios.get(`/user/name/${nickname}`);
};
export const getSignup = async (nickname, email, password, city, district) => {
  return axios.post('/users/signup', {
    nickname,
    email,
    password,
    city,
    district,
  });
};

export const getSignUpForm = async () => {
  return axios.get('/signup');
};
