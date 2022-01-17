import validate from '../helpers/validate';
import { $ } from '../helpers/utils';
import { handleSelectOptions } from '../helpers/select';
import { getSignUpEmail, getSignUpName, getSignup, getSignUpForm } from '../requests';
import header from '../components/header';
import { moveToPage } from '../router';

const $signupButton = $('.sign-up-btn');
const $emailInput = $('.sign-up-form-email');
const $nicknameInput = $('.sign-up-form-name');
const $city = $('#sign-up-form-city');
const $signupForm = $('.sign-up-form');
const $duplicateButton = document.querySelectorAll('.check-duplicated');

// 에러아이콘 활성화, 성공아이콘 비활성화 함수
const hideSuccessIcon = element => {
  element.querySelector('.icon-success').classList.add('hidden');
  element.querySelector('.icon-error').classList.remove('hidden');
};

// 성공아이콘 활성화, 에러아이콘 비활성화 함수
const hideErrorIcon = element => {
  element.querySelector('.icon-error').classList.add('hidden');
  element.querySelector('.icon-success').classList.remove('hidden');
};

// 중복버튼 활성화/비활성화 함수
const setDuplicateBtn = (e, regex, index) => {
  if (regex.test(e.target.value)) {
    $duplicateButton[index].removeAttribute('disabled');
  } else {
    $duplicateButton[index].setAttribute('disabled', '');
  }
};

const checkisDuplicate = (isDuplicate, $error, inputType, $element) => {
  if (isDuplicate) {
    $error.textContent = `이미 존재하는 ${inputType}입니다`;
  } else {
    $error.textContent = `사용 가능한 ${inputType}입니다`;
    $error.style.color = '#2196f3';

    hideErrorIcon($element);
  }
};

const bindEvents = () => {
  header.bindEvents();

  // 회원가입 input 유효성 검사
  $signupForm.addEventListener('input', e => {
    if (e.target.matches('#nickname')) {
      validate.nameValidate(e.target.value, 0, $signupButton);

      hideSuccessIcon($nicknameInput);

      setDuplicateBtn(e, validate.regName, 0);
    } else if (e.target.matches('#email')) {
      validate.emailValidate(e.target.value, 1, $signupButton);

      hideSuccessIcon($emailInput);

      setDuplicateBtn(e, validate.regEmail, 1);
    } else if (e.target.matches('#password')) {
      validate.passwordValidate(e.target.value, 2, $signupButton);

      if (e.target.value) validate.passwordConfirmValidate(e.target.value !== $('#repassword').value, 3, $signupButton);
    } else if (e.target.matches('#repassword')) {
      if (e.target.value) validate.passwordConfirmValidate($('#password').value !== e.target.value, 3, $signupButton);
    }
  });

  // 닉네임 중복확인
  $('.sign-up-form__nickname-btn').addEventListener('click', async ({ target }) => {
    const $errormsg = target.parentElement.querySelector('.error');

    try {
      const res = await getSignUpName($('#nickname').value);
      const isDuplicate = res.data.nicknameDuplication;

      checkisDuplicate(isDuplicate, $errormsg, '닉네임', $nicknameInput);
    } catch (error) {
      console.error(error);
    }
  });

  // 이메일 중복확인
  $('.sign-up-form__email-btn').addEventListener('click', async ({ target }) => {
    const $errormsg = target.parentElement.querySelector('.error');

    try {
      const res = await getSignUpEmail($('#email').value);
      const isDuplicate = res.data.emailDuplication;

      checkisDuplicate(isDuplicate, $errormsg, '이메일', $emailInput);
    } catch (error) {
      console.error(error);
    }
  });

  // 회원가입 완료
  $signupForm.addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const user = {
        nickname: $('#nickname').value,
        email: $('#email').value,
        password: $('#password').value,
        city: $('#sign-up-form-city').value,
        district: $('#sign-up-form-district').value,
      };

      await getSignup(user);
      alert('회원가입이 완료되었습니다.');

      await moveToPage('/signin');
    } catch (error) {
      console.error(error);
    }
  });

  // select 정적으로 추가
  $city.addEventListener('change', e => {
    handleSelectOptions({ $city, $district: $('#sign-up-form-district') });
    validate.selectValidate(!(e.target.value === '시' && $('#sign-up-form-district').value === '구'), 4, $signupButton);
  });

  $('#sign-up-form-district').addEventListener('change', e => {
    validate.selectValidate(e.target.value === '구' && $('#sign-up-form-city').value === '시', 4, $signupButton);
  });
};

window.addEventListener('DOMContentLoaded', bindEvents);
