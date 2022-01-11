// import signup from './pages/signup.js';
import signIn from './pages/signIn';
import header from './components/header';

const init = () => {
  console.log('app');
  // do something;
  header();
  signIn();
};

window.addEventListener('DOMContentLoaded', init);
