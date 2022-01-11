import { $ } from '../helpers/utils';

const headers = () => {
  $('.no-login__login-btn').addEventListener('click', () => {
    history.pushState(null, '', '/signin');
  });

  $('.no-login__signup-btn').addEventListener('click', () => {
    history.pushState(null, null, '/signup');
  });
};

export default headers;
