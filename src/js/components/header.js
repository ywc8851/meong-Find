import { $ } from '../helpers/utils';
import { render } from '../router';

const header = {
  bindEvents() {
    $('.no-login__login-btn').addEventListener('click', async () => {
      history.pushState({ path: 'signin' }, '', 'signin');
      await render('signin');
    });

    $('.no-login__signup-btn').addEventListener('click', async () => {
      history.pushState({ path: 'signup' }, '', 'signup');
      await render('signup');
    });
  },
};

export default header;
