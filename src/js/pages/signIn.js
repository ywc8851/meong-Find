import header from '../components/header';
import { moveToPage, handleHistory } from '../router';
import { $ } from '../helpers/utils';
import validate from '../helpers/validate';
import { postSignIn, changePassword, getUserId } from '../requests';

const $signinbtn = $('.sign-in-btn');

const popupSetting = () => {
  $('.popup').classList.toggle('hidden');
  $('.cover').classList.toggle('hidden');
  $('.popup-find-password').value = '';
  $('.popup-button').setAttribute('disabled', '');
  $('.find-error').classList.add('hidden');
  $('.popup-find-password').focus();
};

const randomPasssword = () => {
  let setStr = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');
  let randomStr = '';

  for (let i = 0; i < 8; i++) {
    randomStr += setStr[Math.floor(Math.random() * setStr.length - 1)];
  }

  return randomStr;
};

const bindEvents = () => {
  header.bindEvents();

  $('.sign-in-form').addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const [email, password, autoLogin] = [
        $('#email').value.trim(),
        $('#password').value.trim(),
        $('#auto__login').checked,
      ];

      const user = await postSignIn(email, password, autoLogin);
      if (user) {
        moveToPage('/');
        return;
      }
      $('.no-user').classList.remove('hidden');
    } catch (error) {
      console.error(error.message);
    }
  });

  $('.find-password').addEventListener('click', () => {
    popupSetting();
  });

  $('.sign-up-link').addEventListener('click', async () => {
    await moveToPage('signup');
  });

  $('.sign-in-form').addEventListener('input', e => {
    if (e.target.matches('#email')) {
      validate.emailValidate(e.target.value, 0, $signinbtn);
    } else if (e.target.matches('#password')) {
      validate.passwordValidate(e.target.value, 1, $signinbtn);
    }
  });

  $('.popup-form').addEventListener('input', e => {
    const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    if (regEmail.test(e.target.value)) {
      $('.popup-button').removeAttribute('disabled');
    } else {
      $('.popup-button').setAttribute('disabled', '');
    }
  });

  $('.popup-button').addEventListener('click', async e => {
    // 1.현재 등록되어있는 이메일 인지 확인해야됨
    // 2-1 등록되어있는 경우 임시 비밀번호 발급해서 그걸로 교체 쳐줌
    // 2-2 안등록이면 다시 입력하라고 오류 문구 출력
    e.preventDefault();

    try {
      const user = await getUserId($('#check-password').value.trim());

      const checkUser = user.data.id;

      if (checkUser) {
        const pwd = randomPasssword().trim();
        const checks = await changePassword(checkUser, pwd);
        if (checks) alert('메일 발송이 완료되었습니다.');
      }
      popupSetting();
    } catch (error) {
      console.error(error);
      $('.find-error').classList.remove('hidden');
    }
  });

  $('.login-exit').addEventListener('click', () => {
    popupSetting();
  });

  window.addEventListener('popstate', handleHistory);
};

const init = () => {
  bindEvents();
  console.log('signin init');
};

window.addEventListener('DOMContentLoaded', init);
