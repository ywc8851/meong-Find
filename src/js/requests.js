import axios from 'axios';

export const getSignUpEmail = async emailValue => {
  return axios.get(`/user/email/${emailValue}`);
};
export const getSignUpName = async nickname => {
  return axios.get(`/user/name/${nickname}`);
};
