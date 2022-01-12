import validate from '../helpers/validate';
import { $ } from '../helpers/utils';
import { getSignUpEmail, getSignUpName, getSignup, getSignUpForm } from '../requests';
import header from '../components/header';

const $signupButton = $('.sign-up-btn');
const $emailInput = $('.sign-up-form-email');
const $nicknameInput = $('.sign-up-form-name');
const $duplicateButton = document.querySelectorAll('.check-duplicated');

const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const regName = /^[^\s]{2,5}$/;

const signUp = () => {
  const $emailInput = $('.sign-up-form-email');
  const $nicknameInput = $('.sign-up-form-name');
  const $duplicateButton = document.querySelectorAll('.check-duplicated');

  $('.sign-up-form').onsubmit = async e => {
    e.preventDefault();

    try {
      const [nickname, email, password, city, district] = [
        $('#nickname').value,
        $('#email').value,
        $('#password').value,
        $('#sign-up-form-city').value,
        $('#sign-up-form-district').value,
      ];

      const res = await getSignup(nickname, email, password, city, district);
      console.log(res);
      // alert('회원가입이 완료되었습니다.');
    } catch (error) {
      console.error(error);
    }
  };
  document.querySelector('.sign-up-form').oninput = e => {
    if (e.target.matches('#nickname')) {
      validate.nameValidate(e.target.value, 0, $signupButton);
      // console.log($nicknameInput.querySelector('.icon-success'));
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

  const $citySelect = $('#sign-up-form-city');
  $citySelect.onchange = () => {
    const $districtSelect = $('#sign-up-form-district');
    let mainOption = $citySelect.options[$citySelect.selectedIndex].innerText;
    let subOptions = {
      seoul: ['강남구', '광진구', '서초구'],
      busan: ['해운대구', '민지구', '시안구'],
    };
    let subOption;
    switch (mainOption) {
      case '서울특별시':
        subOption = subOptions.seoul;
        break;
      case '부산광역시':
        subOption = subOptions.busan;
        break;
    }
    $districtSelect.options.length = 0;

    for (let i = 0; i < subOption.length; i++) {
      let option = document.createElement('option');
      option.innerText = subOption[i];
      $districtSelect.append(option);
    }
  };
};

window.addEventListener('DOMContentLoaded', signUp);
