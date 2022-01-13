import { $ } from '../helpers/utils';
import { moveToPage } from '../router';
import { getSignOut } from '../requests';

const header = {
  bindEvents() {
    $('.no-login__login-btn').addEventListener('click', async () => {
      try {
        moveToPage('signin');
      } catch (error) {
        console.error(error);
      }
    });

    $('.no-login__signup-btn').addEventListener('click', async () => {
      try {
        moveToPage('signup');
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
  },
};

export default header;
