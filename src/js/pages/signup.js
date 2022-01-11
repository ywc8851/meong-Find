import validate from '../helpers/validate';
import { $ } from '../helpers/utils';

const $signupButton = $('.sign-up-btn');
const $emailInput = $('.sign-up-form-email');
const $nicknameInput = $('.sign-up-form-name');
const $checkDuplicatedButton = document.querySelectorAll('.check-duplicated');

document.querySelector('.sign-up-form').oninput = e => {
  if (e.target.matches('#nickname')) {
    validate.nameValidate(e.target.value, 0, $signupButton);
    $nicknameInput.querySelector('.icon-success').classList.add('hidden');
    $nicknameInput.querySelector('.icon-error').classList.remove('hidden');
  } else if (e.target.matches('#email')) {
    validate.emailValidate(e.target.value, 1, $signupButton);
    $emailInput.querySelector('.icon-success').classList.add('hidden');
    $emailInput.querySelector('.icon-error').classList.remove('hidden');
    if (regEmail.test(e.target.value)) {
      $duplicateButton.removeAttribute('disabled');
    } else {
      $duplicateButton.setAttribute('disabled', '');
    }
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 2, $signupButton);
  } else if (e.target.matches('#repassword')) {
    validate.passwordConfirmValidate(document.querySelector('#password').value !== e.target.value, 3, $signupButton);
  }
};
