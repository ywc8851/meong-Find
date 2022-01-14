import { $ } from '../helpers/utils';
import { moveToPage } from '../router';
import { getSignOut, getIsUserLogin } from '../requests';

const header = {
  async bindEvents() {
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

    $('.login__posting-btn').addEventListener('click', () => {
      moveToPage('/register');
    });

    const updateHeaderIfUserLogin = async () => {
      try {
        const {
          data: { user },
        } = await getIsUserLogin();
        if (user?.id) {
          $('.user-nickname').textContent = user?.nickname;
          $('.login').classList.remove('hidden');
          $('.no-login').classList.add('hidden');
        }
        return user;
      } catch (error) {
        console.log('user not login');
      }
    };
    const user = await updateHeaderIfUserLogin();
    return user;
  },
};

export default header;
