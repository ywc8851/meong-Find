import header from './components/header';
import { moveToPage } from './router';
import { getMainPosts, findPosts, getSearchTitle } from './requests';
import { $ } from './helpers/utils';
import { handleSelectOptions } from './helpers/select';
import _ from 'lodash';

const $city = $('#city');
const $district = $('#district');

let page = 1;

const setPosts = posts => {
  const fragment = document.createDocumentFragment();
  posts.forEach(post => {
    // console.log(post.images.length);
    const $card = document.createElement('div');
    $card.classList.add('main-posts-posting-list');
    $card.setAttribute('data-id', post.id);
    $card.innerHTML = `
      <a href="javascript:void(0)">
      <div class="main-posts-img-container">
        <div class="main-posts-img" style="background-image:url(${
          post.images.length ? post.images[0] : 'https://web.yonsei.ac.kr/_ezaid/board/_skin/albumRecent/1/no_image.gif'
        })">
        </div>
      </div>
      <span class="main-posts-title">${post.title}</span>
      <span class="main-posts-species species-${
        post.animal === '강아지' ? 'dog' : post.animal === '고양이' ? 'cat' : 'etc'
      }">${post.animal}</span>
      <span class="main-posts-place">${post.city} ${post.district}</span>
      </a>`;

    // console.log($card);

    fragment.appendChild($card);
  });

  $('.main-posts').appendChild(fragment);
};

//데이터 추가함수
const loadPosts = async () => {
  const { data: posts } = await getMainPosts(page);
  setPosts(posts);
  page += 1;
};

const inetersectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    }
    loadPosts();
  });
});

const render = (() => {
  window.onload = async () => {
    try {
      inetersectionObserver.observe($('.main-scroll'));
    } catch (e) {
      console.error(e);
    }
  };
})();

const bindEvents = () => {
  header.bindEvents();
};

$city.onchange = () => {
  handleSelectOptions({ $city, $district });
};

const $searchInput = $('.search-input');
const $navSearchButton = $('.main-nav-search-btn');

$searchInput.onkeypress = ({ key }) => {
  if (key !== 'Enter') return;

  const content = $searchInput.value.trim();

  if (key !== 'Enter' || content === '') {
    $navSearchButton.disabled = false;
    return;
  }
  $navSearchButton.disabled = false;

  $searchInput.value = '';
  filterTitle(content);
};
$navSearchButton.onclick = () => {
  filterTitle($searchInput.value);
};

const filterTitle = async inputValue => {
  try {
    const { data: posts } = await getSearchTitle(inputValue);

    posts.length > 0
      ? ($('.main-posts').innerHTML = '' && setPosts(posts))
      : ($('.main-posts').innerHTML = '<div class="search-error">해당하는 게시물이 존재하지 않습니다.</div>');
  } catch (error) {
    console.error(error);
  }
};

const $findButton = $('.main-nav-find-btn');

$findButton.onclick = async () => {
  const [city, district, species] = [$city.value, $district.value, $('#kind').value];
  try {
    const { data: posts } = await findPosts(city, district, species);
    if (posts) {
      let postlist = '';
      console.log(postlist);
      posts.map(post => {
        postlist += `
        <div data-id="${post.id}" class="main-posts-posting-list">
          <a href="javascript:void(0)">
            <img src="${post.images[0]}" alt="" />
            <span class="main-posts-title">${post.title}</span>
            <span class="main-posts-species species-dog">${post.animal}</span>
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

$('.main-posts').onclick = ({ target }) => {
  if (target.classList.contains('main-posts')) return;
  try {
    moveToPage(`/post/${target.dataset.id}`);
  } catch (error) {
    console.log(error);
  }
};

$('.arrow-up').onclick = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

window.onscroll = _.throttle(() => {
  $('.arrow-up').classList.toggle('hidden', window.pageYOffset <= 300);
}, 100);

$('.main-nav-find').addEventListener('change', e => {
  if (!e.target.matches('select')) return;
  if ($('#city').value !== '시' && $('#district').value !== '구' && $('#kind').value !== '종류') {
    $('.main-nav-find-btn').removeAttribute('disabled');
  } else {
    $('.main-nav-find-btn').setAttribute('disabled', '');
  }
});

window.addEventListener('DOMContentLoaded', bindEvents);
