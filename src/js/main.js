import header from './components/header';
import { handleHistory } from './router';

const bindEvents = () => {
  header.bindEvents();

  window.addEventListener('popstate', handleHistory);
};

const init = () => {
  bindEvents();
};

window.addEventListener('DOMContentLoaded', init);
