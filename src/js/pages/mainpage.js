import header from '../components/header';
import { handleHistory } from '../router';
import { getMainPosts } from '../requests';
import { $ } from '../helpers/utils';

const render = (() => {
  window.onload = async () => {
    try {
      const { data: posts } = await getMainPosts();
      if (posts) {
        // 성공적으로 가져왔을 때
        let postlist = '';
        posts.map(post => {
          postlist += `<div>
          <img src="${post.images[0]}" alt="" />
          <span class="main-posts-title">${post.title}</span>
          <span class="main-posts-species species-dog">${post.animal}</span>
          <span class="main-posts-place">${post.city} ${post.district}</span>
        </div>`;
        });
        console.log(postlist);
        $('.main-posts').innerHTML = postlist;
      }
    } catch (e) {
      console.error(e);
    }
  };
})();

const bindEvents = () => {
  header.bindEvents();

  window.addEventListener('popstate', handleHistory);
};

const init = async () => {
  bindEvents();
  // try {
  //   console.log('ee');
  //   const res = await getMainPosts();
  // } catch (error) {
  //   console.error(error);
  // }
};

window.addEventListener('DOMContentLoaded', init);
