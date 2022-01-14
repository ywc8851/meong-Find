import header from './components/header';
import { handleHistory, moveToPage } from './router';
import { getMainPosts, findPosts } from './requests';
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
    } catch (e) {
      console.error(e);
    }
  };
})();

const bindEvents = () => {
  header.bindEvents();

  window.addEventListener('popstate', handleHistory);
};

const init = () => {
  bindEvents();
};

$citySelect.onchange = () => {
  const $districtSelect = $('#district');
  let mainOption = $citySelect.options[$citySelect.selectedIndex].innerText;
  let subOptions = {
    seoul: ['강남구', '광진구', '서초구'],
    busan: ['해운대구', '민지구', '시안구'],
  };
  let subOption;
  switch (mainOption) {
    case '서울특별시':
      subOption = subOptions.seoul;
      break;
    case '부산광역시':
      subOption = subOptions.busan;
      break;
  }
  $districtSelect.options.length = 0;

  for (let i = 0; i < subOption.length; i++) {
    let option = document.createElement('option');
    option.innerText = subOption[i];
    $districtSelect.append(option);
  }
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

const filterTitle = inputValue => {
  // 검색하는 filter
};
const $findButton = $('.main-nav-find-btn');

$findButton.onclick = async () => {
  const [city, district, species] = [$('#city').value, $('#district').value, $('#kind').value];
  console.log(city, district, species);
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

window.addEventListener('DOMContentLoaded', init);
