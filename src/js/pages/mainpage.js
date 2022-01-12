import header from '../components/header';
import { handleHistory } from '../router';
import { getMainPosts, searchTitile } from '../requests';
import { $ } from '../helpers/utils';

const $citySelect = $('#city');
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
window.addEventListener('DOMContentLoaded', init);
