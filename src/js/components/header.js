import { $ } from '../helpers/utils';
import { moveToPage } from '../router';
import { getSignOut, getIsUserLogin } from '../requests';

const header = {
  bindEvents() {
    $('.logo-container').addEventListener('click', async () => {
      try {
        moveToPage('/');
      } catch (error) {
        console.error(error);
      }
    });

    $('.no-login__signin-btn').addEventListener('click', async () => {
      try {
        moveToPage('/signin');
      } catch (error) {
        console.error(error);
      }
    });

    $('.no-login__signup-btn').addEventListener('click', async () => {
      try {
        moveToPage('/signup');
      } catch (error) {
        console.error(error);
      }
    });

    $('.login__mypage-btn').addEventListener('click', async () => {
      try {
        moveToPage('/mypage');
      } catch (error) {
        console.error(error);
      }
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

    (async () => {
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
    })();
  },
};

export default header;
