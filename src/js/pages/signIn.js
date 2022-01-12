import header from '../components/header';
import { moveToPage, handleHistory } from '../router';
import { $ } from '../helpers/utils';

const bindEvents = () => {
  header.bindEvents();

  $('.sign-in-form').addEventListener('submit', e => {
    e.preventDefault();
  });

  $('.find-password').addEventListener('click', () => {
    // pop up modal
    console.log('비밀번호 찾기 모달');
  });

  $('.sign-up-link').addEventListener('click', async () => {
    await moveToPage('signup');
  });

  window.addEventListener('popstate', handleHistory);
};

const init = () => {
  bindEvents();
};

window.addEventListener('DOMContentLoaded', init);
