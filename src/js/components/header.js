import { $ } from '../helpers/utils';
import { moveToPage } from '../router';
import { getSignOut, getIsUserLogin } from '../requests';

const header = {
  bindEvents() {
    $('.no-login__signin-btn').addEventListener('click', () => {
      moveToPage('signin');
    });

    $('.no-login__signup-btn').addEventListener('click', () => {
      moveToPage('signup');
    });

    $('.login__logout-btn').addEventListener('click', async () => {
      console.log('logout');
      try {
        const { status } = await getSignOut();
        if (status === 200) {
          alert('로그아웃 되었습니다.');
        }
        moveToPage('/');
      } catch (error) {
        console.error(error);
      }
    });

    $('.login__posting-btn').addEventListener('click', () => {
      moveToPage('/register');
    });

    const updateHeaderIfUserLogin = async () => {
      try {
        const {
          data: { nickname },
        } = await getIsUserLogin();
        if (nickname) {
          $('.user-nickname').textContent = nickname;
          $('.login').classList.remove('hidden');
          $('.no-login').classList.add('hidden');
        }
      } catch (error) {
        console.log('user not login');
      }
    };
    updateHeaderIfUserLogin();
  },
};

export default header;
