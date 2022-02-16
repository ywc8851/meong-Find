import { $ } from '../helpers/utils';
import { moveToPage, handleHistory, createDocument } from '../router';
import { logOutUser, getIsUserLogin, getKakaoRestApiKey } from '../requests';
import { KAKAO_HOST, KAKAO_LOGOUT_REDIRECT_URI } from '../helpers/oAuth';

const header = {
  async bindEvents() {
    window.addEventListener('popstate', handleHistory);
    let user = null;

    $('.logo-container').addEventListener('click', async () => {
      try {
        moveToPage('/');
        sessionStorage.removeItem('filterOption');
        sessionStorage.removeItem('scrollPosition');
      } catch (error) {
        console.error(error);
      }
    });

    $('.no-login__signin-btn').addEventListener('click', async () => {
      try {
        sessionStorage.removeItem('scrollPosition');
        moveToPage('/signin');
      } catch (error) {
        console.error(error);
      }
    });

    $('.no-login__signup-btn').addEventListener('click', async () => {
      try {
        sessionStorage.removeItem('scrollPosition');
        moveToPage('/signup');
      } catch (error) {
        console.error(error);
      }
    });

    $('.login__mypage-btn').addEventListener('click', async () => {
      try {
        sessionStorage.removeItem('scrollPosition');
        moveToPage('/mypage');
      } catch (error) {
        console.error(error);
      }
    });

    $('.login__logout-btn').addEventListener('click', async () => {
      try {
        if (user?.isKakaoUser) {
          const { data: REST_API_KEY } = await getKakaoRestApiKey();
          location.href = `https://${KAKAO_HOST}/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${KAKAO_LOGOUT_REDIRECT_URI}`;
          return;
        }

        const { data, status } = await logOutUser(user);
        if (status === 200) {
          alert('로그아웃 되었습니다.');
          createDocument(data);
          history.pushState({ path: '/', prev: location.href }, '', '/');
        }
        sessionStorage.removeItem('scrollPosition');
      } catch (error) {
        console.error(error);
      }
    });

    $('.login__posting-btn').addEventListener('click', () => {
      sessionStorage.setItem('isEditingPost', false);
      moveToPage('/register');
    });

    const updateHeaderIfUserLogin = async () => {
      try {
        const {
          data: { user },
        } = await getIsUserLogin();
        if (user?.email) {
          $('.user-nickname').textContent = user?.nickname;
          $('.login').classList.remove('hidden');
          $('.no-login').classList.add('hidden');
        }
        return user;
      } catch (error) {
        console.log('user not login');
      }
    };
    user = await updateHeaderIfUserLogin();
    return user;
  },
};

export default header;
