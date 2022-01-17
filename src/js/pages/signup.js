import validate from '../helpers/validate';
import { $ } from '../helpers/utils';
import { handleSelectOptions } from '../helpers/select';
import { getSignUpEmail, getSignUpName, getSignup, getSignUpForm } from '../requests';
import header from '../components/header';
import { moveToPage } from '../router';

header.bindEvents();

const $signupButton = $('.sign-up-btn');
const $emailInput = $('.sign-up-form-email');
const $nicknameInput = $('.sign-up-form-name');
// 이거 이렇게 쓰지말기 버튼 ~
const $duplicateButton = document.querySelectorAll('.check-duplicated');

// validate 에서 가져오기
const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const regName = /^[^\s]{2,8}$/;

// 회원가입 완료
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

    await getSignup(nickname, email, password, city, district);
    alert('회원가입이 완료되었습니다.');

    await moveToPage('/signin');
  } catch (error) {
    console.error(error);
  }
};

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

// 회원가입 input 유효성 검사
$('.sign-up-form').oninput = e => {
  if (e.target.matches('#nickname')) {
    validate.nameValidate(e.target.value, 0, $signupButton);

    hideSuccessIcon($nicknameInput);

    setDuplicateBtn(e, regName, 0);
  } else if (e.target.matches('#email')) {
    validate.emailValidate(e.target.value, 1, $signupButton);

    hideSuccessIcon($emailInput);

    setDuplicateBtn(e, regEmail, 1);
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 2, $signupButton);

    if (e.target.value) validate.passwordConfirmValidate(e.target.value !== $('#repassword').value, 3, $signupButton);
  } else if (e.target.matches('#repassword')) {
    if (e.target.value) validate.passwordConfirmValidate($('#password').value !== e.target.value, 3, $signupButton);
  }
};

// $('.sign-up-form-area').onchange = () => {
//   console.log('change');
//   if (!e.target.matches('select')) return;
//   // else if (e.target.matches('#sign-up-form-city')) {
//   //   console.log('시 선택');
//   // } else {
//   //   console.log('구 선택');
//   // }
// };

// 닉네임 중복확인
$duplicateButton[0].onclick = async ({ target }) => {
  const $errormsg = target.parentElement.querySelector('.error');

  try {
    const res = await getSignUpName($('#nickname').value);
    const isDuplicate = res.data.nicknameDuplication;

    if (isDuplicate) {
      $errormsg.textContent = '이미 존재하는 닉네임입니다';
    } else {
      $errormsg.textContent = '사용 가능한 닉네임입니다';
      $errormsg.style.color = '#2196f3';

      hideErrorIcon($nicknameInput);
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
    const isDuplicate = res.data.emailDuplication;

    if (isDuplicate) {
      $errormsg.textContent = '이미 존재하는 이메일입니다';
    } else {
      $errormsg.textContent = '사용 가능한 이메일입니다';
      $errormsg.style.color = '#2196f3';

      hideErrorIcon($emailInput);
    }
  } catch (error) {
    console.error(error);
  }
};

// select 정적으로 추가
const $city = $('#sign-up-form-city');
$city.addEventListener('change', e => {
  handleSelectOptions({ $city, $district: $('#sign-up-form-district') });
  validate.selectValidate(!(e.target.value === '시' && $('#sign-up-form-district').value === '구'), 4, $signupButton);
});

$('#sign-up-form-district').addEventListener('change', e => {
  validate.selectValidate(e.target.value === '구' && $('#sign-up-form-city').value === '시', 4, $signupButton);
});
