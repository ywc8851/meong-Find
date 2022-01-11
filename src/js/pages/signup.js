import validate from '../helpers/validate';
import { $ } from '../helpers/utils';
import { getSignUpEmail, getSignUpName, getSignup } from '../requests';

const $signupButton = $('.sign-up-btn');
const $emailInput = $('.sign-up-form-email');
const $nicknameInput = $('.sign-up-form-name');
const $duplicateButton = document.querySelectorAll('.check-duplicated');

const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const regName = /^[^\s]{2,5}$/;

const signUp = () => {
  document.querySelector('.sign-up-form').oninput = e => {
    if (e.target.matches('#nickname')) {
      validate.nameValidate(e.target.value, 0, $signupButton);
      $nicknameInput.querySelector('.icon-success').classList.add('hidden');
      $nicknameInput.querySelector('.icon-error').classList.remove('hidden');

      if (regName.test(e.target.value)) {
        $duplicateButton[0].removeAttribute('disabled');
      } else {
        $duplicateButton[0].setAttribute('disabled', '');
      }
    } else if (e.target.matches('#email')) {
      validate.emailValidate(e.target.value, 1, $signupButton);
      $emailInput.querySelector('.icon-success').classList.add('hidden');
      $emailInput.querySelector('.icon-error').classList.remove('hidden');

      if (regEmail.test(e.target.value)) {
        $duplicateButton[1].removeAttribute('disabled');
      } else {
        $duplicateButton[1].setAttribute('disabled', '');
      }
    } else if (e.target.matches('#password')) {
      validate.passwordValidate(e.target.value, 2, $signupButton);
    } else if (e.target.matches('#repassword')) {
      validate.passwordConfirmValidate(document.querySelector('#password').value !== e.target.value, 3, $signupButton);
    }
  };

  $duplicateButton[0].onclick = async ({ target }) => {
    const $errormsg = target.parentElement.querySelector('.error');

    try {
      const name = document.querySelector('#nickname').value;
      const res = await getSignUpName(name);
      const isDuplicate = res.data.nicknameDuplicate;

      if (isDuplicate) {
        // console.log('이미 존재');
        $errormsg.textContent = '이미 존재하는 닉네임입니다';
      } else {
        $errormsg.textContent = '사용 가능한 닉네임입니다';
        $errormsg.style.color = '#2196f3';
        $nicknameInput.querySelector('.icon-error').classList.add('hidden');
        $nicknameInput.querySelector('.icon-success').classList.remove('hidden');
      }
    } catch (error) {
      console.error(error);
    }
  };
  $duplicateButton[1].onclick = async ({ target }) => {
    const $errormsg = target.parentElement.querySelector('.error');

    try {
      const emailValue = document.querySelector('#email').value;
      const res = await getSignUpEmail(emailValue);
      const isDuplicate = res.data.emailDuplicate;

      console.log(typeof isDuplicate);
      if (isDuplicate) {
        // console.log('이미 존재');
        $errormsg.textContent = '이미 존재하는 이메일입니다';
      } else {
        $errormsg.textContent = '사용 가능한 이메일입니다';
        $errormsg.style.color = '#2196f3';
        $emailInput.querySelector('.icon-error').classList.add('hidden');
        $emailInput.querySelector('.icon-success').classList.remove('hidden');
      }
    } catch (error) {
      console.error(error);
    }
  };
};

$signupButton.onclick = () => {
  e.preventDefault();

  try {
    const nickname = $('#nickname').value;
    const email = $('#email').value;
    const password = document.querySelector('#password').value;

    getSignup(nickname, email, password);

    alert('회원가입이 완료되었습니다.');
    window.location.href = '/signin';
  } catch (error) {
    console.error(error);
  }
};

export default signUp;
