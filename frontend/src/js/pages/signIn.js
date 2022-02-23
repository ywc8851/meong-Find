import header from '../components/header';
import { moveToPage } from '../router';
import { $ } from '../helpers/utils';
import validate from '../helpers/validate';
import { logInUser, changePassword, getUserId, getKakaoRestApiKey } from '../requests';
import { KAKAO_HOST, KAKAO_REDIRECT_URI } from '../helpers/oAuth';

const $signinbtn = $('.sign-in-btn');
const $kakaoLoginBtn = $('.sign-in-kakao');

const handlePopup = () => {
  $('.popup').classList.toggle('hidden');
  $('.signin-cover').classList.toggle('hidden');
  $('.popup-find-password').value = '';
  $('.popup-button').setAttribute('disabled', '');
  $('.find-error').classList.add('hidden');
  $('.popup-find-password').focus();
};

const randomPasssword = () => {
  let setStr = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');
  let randomStr = '';

  for (let i = 0; i < 8; i++) {
    randomStr += setStr[Math.floor(Math.random() * (setStr.length - 1))];
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

      const user = await logInUser(email, password, autoLogin);
      console.log(user);
      if (user) {
        await moveToPage('/');
        return;
      }
      $('.no-user').classList.remove('hidden');
    } catch (error) {
      console.error(error);
    }
  });

  $('.find-password').addEventListener('click', () => {
    handlePopup();
  });

  $('.sign-up-link').addEventListener('click', async () => {
    await moveToPage('/signup');
  });

  $('.sign-in-form').addEventListener('input', e => {
    e.target.matches('#email')
      ? validate.emailValidate(e.target.value, 0, $signinbtn)
      : validate.passwordValidate(e.target.value, 1, $signinbtn);
  });

  $('.popup-form').addEventListener('input', e => {
    validate.regEmail.test(e.target.value)
      ? $('.popup-button').removeAttribute('disabled')
      : $('.popup-button').setAttribute('disabled', '');
  });

  $('.popup-button').addEventListener('click', async e => {
    e.preventDefault();

    try {
      const user = await getUserId($('#check-password').value.trim());
      const pwd = randomPasssword().trim();

      await changePassword(user.data.id, pwd);
      alert('메일 발송이 완료되었습니다.');
      handlePopup();
    } catch (error) {
      console.error(error);
      $('.find-error').classList.remove('hidden');
    }
  });

  $('.login-exit').addEventListener('click', handlePopup);

  $kakaoLoginBtn.addEventListener('click', async () => {
    const { data: REST_API_KEY } = await getKakaoRestApiKey();
    const tokenRequestUrl = `https://${KAKAO_HOST}/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    location.href = tokenRequestUrl;
  });
};

window.addEventListener('DOMContentLoaded', bindEvents);
