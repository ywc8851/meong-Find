import { getSignInTemplate } from '../requests';
import { $ } from '../helpers/utils';

const signIn = () => {
  const fetch = async () => {
    console.error('[signin]', location.pathname);
    if (location.pathname !== '/signin') return;
    const { data } = await getSignInTemplate('/signin');
    document.querySelector('#app').innerHTML = data;

    $('.sign-in-form').addEventListener('submit', e => {
      e.preventDefault();
      console.log('test');
    });

    $('.sign-up-link').addEventListener('click', () => {
      history.pushState(null, '', '/signup');
    });
  };

  window.addEventListener('popstate', fetch);
};

export default signIn;
