import header from '../components/header';
import { handleHistory } from '../router';
import { getMainPosts } from '../requests';

const bindEvents = () => {
  header.bindEvents();

  window.addEventListener('popstate', handleHistory);
};

const init = async () => {
  bindEvents();
  try {
    const res = await getMainPosts();
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('DOMContentLoaded', init);
