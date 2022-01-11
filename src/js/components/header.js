import { $ } from '../helpers/utils';

const headers = () => {
  $('.no-login__login-btn').addEventListener('click', () => {
    history.pushState(null, '', '/signin');
  });

  $('.no-login__signup-btn').addEventListener('click', () => {
    console.log('clikced');
    history.pushState(null, '', '/signup');
  });
};

export default headers;
