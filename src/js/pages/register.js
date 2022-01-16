import header from '../components/header';
import { $ } from '../helpers/utils';
import { handleSelectOptions } from '../helpers/select';
import { bindImageEvents, uploadImage } from '../helpers/inputImageFile';
import { addNewPost } from '../requests';
import { handleHistory } from '../router';

const $inputFile = $('.register-upload__input');
const $registerUpload = $('.register-upload');
const $registerForm = $('.register-form');
const $city = $('#city');
const $district = $('#district');

const state = {
  title: '',
  images: [],
  city: '',
  district: '',
  animal: $('#animal').value,
  type: '',
  content: '',
  writerId: '',
};

const registPost = async e => {
  e.preventDefault();

  try {
    const images = await uploadImage();
    state.images = images.map(({ filename }) => `img/${filename}`);

    const {
      data: { post },
    } = await addNewPost({ ...state, title: state.title.trim(), content: state.content.trim() });
    alert('포스트가 등록되었습니다.');
    // moveToPage
    // 작업 미완료
  } catch (error) {
    console.error(error);
  }
};

const updateSelectByUser = user => {
  state.writerId = user.id;
  state.city = user.city;
  state.district = user.district;

  $city.value = user.city;
  handleSelectOptions({ $city, $district });
  $district.value = user.district;
};

const bindEvents = async () => {
  const user = await header.bindEvents();
  updateSelectByUser(user);
  bindImageEvents();

  $registerUpload.addEventListener('click', () => {
    $inputFile.click();
  });

  $('.register-title-input').addEventListener('keyup', ({ target: { value } }) => {
    state.title = value;
  });

  $city.addEventListener('change', ({ target: { value } }) => {
    handleSelectOptions({ $city, $district });
    state.city = value;
  });

  $district.addEventListener('change', ({ target: { value } }) => {
    state.district = value;
  });

  $('#animal').addEventListener('change', ({ target: { value } }) => {
    state.animal = value;
  });

  $('#animalType').addEventListener('keyup', ({ target: { value } }) => {
    state.type = value;
  });

  $('#content').addEventListener('keyup', ({ target: { value } }) => {
    state.content = value;
  });

  $registerForm.addEventListener('submit', registPost);
  window.addEventListener('popstate', handleHistory);
};

const init = () => {
  bindEvents();
};

window.addEventListener('DOMContentLoaded', init);
