import { $ } from '../helpers/utils';

$('.no-login__login-btn').addEventListener('click', () => {
  history.pushState(null, null, '/signin');
});
