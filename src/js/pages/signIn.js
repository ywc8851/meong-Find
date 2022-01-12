import header from '../components/header';
import { handleHistory } from '../router';
import { $ } from '../helpers/utils';
import validate from '../helpers/validate';

const $signinbtn = $('.sign-in-btn');
const $emailInput = $('.sign-in-form-email');

const togglePopup = () => {
  $('.popup').classList.toggle('hidden');
  $('.cover').classList.toggle('hidden');
};

const bindEvents = () => {
  header.bindEvents();

  $('.sign-in-form').onsubmit = async e => {};

  $('.find-password').addEventListener('click', () => {
    togglePopup();
  });

  $('.sign-up-link').addEventListener('click', () => {
    history.pushState({ path: 'signup' }, '', 'signup');
  });

  $('.sign-in-form').addEventListener('input', e => {
    if (e.target.matches('#email')) {
      validate.emailValidate(e.target.value, 0, $signinbtn);
    } else if (e.target.matches('#password')) {
      validate.passwordValidate(e.target.value, 1, $signinbtn);
    }
  });

  $('.login-exit').addEventListener('click', () => {
    togglePopup();
  });

  window.addEventListener('popstate', handleHistory);
};

const init = () => {
  bindEvents();
};

window.addEventListener('DOMContentLoaded', init);
