import header from './components/header';
import { handleHistory } from './router';
import { getMainPosts, findPosts, searchTitile } from './requests';
import { $ } from './helpers/utils';

const $citySelect = $('#city');
const render = (() => {
  window.onload = async () => {
    console.log('upload 완료');
    try {
      const { data: posts } = await getMainPosts();
      if (posts) {
        // console.log(posts);
        // 성공적으로 가져왔을 때
        let postlist = '';
        posts.map(post => {
          postlist += `
        <div>
          <a href="#">
            <img src="${post.images[0]}" alt="${post.title} 이미지" />
            <span class="main-posts-title">${post.title}</span>
            <span class="main-posts-species species-${
              post.animal === '강아지' ? 'dog' : post.animal === '고양이' ? 'cat' : 'etc'
            }">${post.animal}</span>
            <span class="main-posts-place">${post.city} ${post.district}</span>
          </a>
        </div>`;
        });
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
  //   const res = await getMainPosts();
  //   console.log(res);
  // } catch (error) {
  //   console.error(error);
  // }
};

window.addEventListener('DOMContentLoaded', init);
