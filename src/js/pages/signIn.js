import header from '../components/header';
import { moveToPage, handleHistory } from '../router';
import { $ } from '../helpers/utils';
import validate from '../helpers/validate';
import { postSignIn } from '../requests';

const $signinbtn = $('.sign-in-btn');
const $emailInput = $('.sign-in-form-email');

const togglePopup = () => {
  $('.popup').classList.toggle('hidden');
  $('.cover').classList.toggle('hidden');
};

let checked = false;

const bindEvents = () => {
  header.bindEvents();

  $('.sign-in-form').addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const [email, password, autoLogin] = [$('#email').value, $('#password').value, checked];

      const user = await postSignIn(email, password, autoLogin);

      if (user) {
        moveToPage('/mainpage');
        return;
      }
      $('.no-user').classList.remove('hidden');
    } catch (error) {
      console.error(error.message);
    }
  });

  $('.find-password').addEventListener('click', () => {
    togglePopup();
  });

  $('.sign-up-link').addEventListener('click', async () => {
    await moveToPage('signup');
  });

  $('#auto__login').addEventListener('change', () => {
    checked = !checked;
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
