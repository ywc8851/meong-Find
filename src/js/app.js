import signIn from './pages/signIn';
import header from './components/header';
import signUp from './pages/signup.js';

const init = () => {
  console.log('app');
  // do something;
  header();
  signIn();
  signUp();
};

window.addEventListener('DOMContentLoaded', init);
