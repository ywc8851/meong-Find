import header from './components/header';
import { moveToPage } from './router';
import { getMainPosts, findPosts, getSearchTitle } from './requests';
import { $ } from './helpers/utils';
import { handleSelectOptions } from './helpers/select';
import _ from 'lodash';

const $city = $('#city');
const $district = $('#district');

const count = 6;
let index = 0;
let postLength = 0;

//데이터 추가함수
const loadPosts = async () => {
  const { data: posts } = await getMainPosts();
  postLength = posts.length;

  for (let i = index; i < index + count; i++) {
    if (postLength <= i) {
      break;
    }

    const $div = document.createElement('div');

    $div.classList.add('main-posts-posting-list');

    $div.setAttribute('data-id', posts[i].id);

    $div.innerHTML = `
    <a href="javascript:void(0)">
    <img src="${posts[i].images[0]}" alt="${posts[i].title} 이미지" />
    <span class="main-posts-title">${posts[i].title}</span>
    <span class="main-posts-species species-${
      posts[i].animal === '강아지' ? 'dog' : posts[i].animal === '고양이' ? 'cat' : 'etc'
    }">${posts[i].animal}</span>
    <span class="main-posts-place">${posts[i].city} ${posts[i].district}</span>
  </a>`;

    $('.main-posts').appendChild($div);
  }

  index += count;
};

// IntersectionObserver 갱신 함수
const observeLastChild = intersectionObserver => {
  const listChildren = document.querySelectorAll('.main-posts-posting-list');

  listChildren.forEach(el => {
    if (!el.nextSibling && index < postLength) {
      intersectionObserver.observe(el); // el에 대하여 관측 시작
      console.log('관측시작');
    } else if (index >= postLength) {
      intersectionObserver.disconnect();
      console.log('페이지의 끝입니다.');
    }
  });
};

const io = new IntersectionObserver((entries, observe) => {
  entries.forEach(entry => {
    // entry.isIntersecting: 특정 요소가 뷰포트와 50%(threshold 0.5) 교차되었으면

    if (entry.isIntersecting) {
      setTimeout(() => {
        observeLastChild(observe);
        loadPosts();
      }, 1000);
    }
  });
});

const setPosts = posts => {
  if (posts) {
    let postlist = '';
    posts.map(post => {
      postlist += `
      <div data-id="${post.id}" class="main-posts-posting-list">
      <a href="javascript:void(0)">
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
};

const render = (() => {
  window.onload = async () => {
    try {
      const { data: posts } = await getMainPosts();
      io.observe(document.querySelector('.main-scroll'));
      loadPosts();
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
      ? setPosts(posts)
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
