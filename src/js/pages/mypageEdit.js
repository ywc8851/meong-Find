import validate from '../helpers/validate';
import header from '../components/header';
import { moveToPage } from '../router';
import { getMyProfile, getSignUpName, changeUserProfile, deleteUserProfile } from '../requests';
import { $ } from '../helpers/utils';
import { handleSelectOptions } from '../helpers/select';

let originNickname = '';
let curUserId;

const $nicknameInput = $('.sign-up-form-name');
const $duplicateButton = $('.check-duplicated');
const $city = $('#sign-up-form-city');
const $profileChangeBtn = $('.profile-change-btn');

// 회원탈퇴 팝업창
const handlePopup = () => {
  $('.popup').classList.toggle('hidden');
  $('.cover').classList.toggle('hidden');
  $('.popup-find-password').value = '';
  // $('.popup-button').setAttribute('disabled', '');
  $('.find-error').classList.add('hidden');
  $('.popup-find-password').focus();
};

const bindEvents = () => {
  header.bindEvents();

  // 유효성 검사
  $('.sign-up-form').addEventListener('input', e => {
    if (e.target.matches('#nickname')) {
      validate.nameValidate(e.target.value, 0, $profileChangeBtn);
      $nicknameInput.querySelector('.icon-success').classList.add('hidden');
      $nicknameInput.querySelector('.icon-error').classList.remove('hidden');

      if (validate.regName.test(e.target.value)) {
        $duplicateButton.removeAttribute('disabled');
      } else {
        $duplicateButton.setAttribute('disabled', '');
      }
    } else if (e.target.matches('#password')) {
      validate.passwordValidate(e.target.value, 1, $profileChangeBtn);
      if (e.target.value)
        validate.passwordConfirmValidate(e.target.value !== $('#repassword').value, 2, $profileChangeBtn);
    } else if (e.target.matches('#repassword')) {
      if (e.target.value)
        validate.passwordConfirmValidate($('#password').value !== e.target.value, 2, $profileChangeBtn);
    }
  });

  // select 유효성 검사
  $city.addEventListener('change', e => {
    handleSelectOptions({ $city, $district: $('#sign-up-form-district') });

    validate.selectValidate(
      !(e.target.value === '시' && $('#sign-up-form-district').value === '구'),
      3,
      $profileChangeBtn
    );
  });

  $('#sign-up-form-district').addEventListener('change', e => {
    validate.selectValidate(e.target.value === '구' && $('#sign-up-form-city').value === '시', 3, $profileChangeBtn);
  });

  // 닉네임 중복확인
  $duplicateButton.addEventListener('click', async e => {
    e.preventDefault();
    const $errormsg = $nicknameInput.querySelector('.error');

    try {
      const name = document.querySelector('#nickname').value;
      const res = await getSignUpName(name);
      const isDuplicate = res.data.nicknameDuplication;
      const isOriginname = name === originNickname;

      if (!isDuplicate || isOriginname) {
        $errormsg.textContent = '사용 가능한 닉네임입니다';
        $errormsg.style.color = '#2196f3';
        $nicknameInput.querySelector('.icon-error').classList.add('hidden');
        $nicknameInput.querySelector('.icon-success').classList.remove('hidden');
      } else {
        $errormsg.textContent = '이미 존재하는 닉네임입니다';
      }
    } catch (error) {
      console.error(error);
    }
  });

  $('.profile-delete-btn').addEventListener('click', handlePopup);

  $('.login-exit').addEventListener('click', handlePopup);

  $('.delete-button').addEventListener('click', async e => {
    e.preventDefault();

    try {
      const iscorrectPwd = await deleteUserProfile(curUserId, $('#check-password').value);
      if (!iscorrectPwd) {
        throw new Error('비밀번호가 일치하지 않습니다');
      }
      alert('회원 탈퇴 처리되었습니다.');
      handlePopup();
      moveToPage('/');
    } catch (error) {
      console.error(error);
      $('.find-error').classList.remove('hidden');
    }
  });

  $profileChangeBtn.addEventListener('click', async e => {
    e.preventDefault();

    try {
      const user = {
        nickname: $('#nickname').value,
        password: $('#password').value,
        city: $('#sign-up-form-city').value,
        district: $('#sign-up-form-district').value,
      };

      await changeUserProfile(curUserId, user);

      moveToPage('/mypage');
    } catch (e) {
      console.error(e);
    }
  });
};

window.addEventListener('DOMContentLoaded', bindEvents);

// 프로필 정보 서버로부터 가져오기
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const {
      data: [user],
    } = await getMyProfile();

    // originNickname으로 변경
    originNickname = user.nickname;
    $('#nickname').value = originNickname;
    $('#email').value = user.email;
    $duplicateButton.removeAttribute('disabled');

    curUserId = user.id;
  } catch (e) {
    console.error(e);
  }
});
