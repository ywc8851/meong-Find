import header from '../components/header';
import { $, handleSelectOptions } from '../helpers/utils';
import { bindImageEvents, uploadImage } from '../helpers/inputImageFile';
import { addNewPost } from '../requests';

const $inputFile = $('.register-upload__input');
const $registerUpload = $('.register-upload');
const $registerForm = $('.register-form');
const $citySelect = $('#city');
const $districtSelect = $('#district');

const state = {
  title: '',
  images: [],
  city: '',
  district: '',
  animal: '',
  type: '',
  content: '',
  writerNickname: '',
};

const registPost = async e => {
  e.preventDefault();
  try {
    const images = await uploadImage();
    console.log(images);
    state.images = images.map(image => `img/${image.name}`);
  } catch (error) {
    console.error(error);
  }
};

const bindEvents = () => {
  header.bindEvents();
  bindImageEvents();

  $registerUpload.addEventListener('click', () => {
    $inputFile.click();
  });

  $('.register-title-input').addEventListener('keyup', ({ target: { value } }) => {
    state.title = value;
  });

  $citySelect.addEventListener('change', () => {
    const city = handleSelectOptions({ city: $citySelect, district: $districtSelect });
    state.city = city;
  });

  // $districtSelect.addEventListener('click', () => {

  // })

  $districtSelect.addEventListener('change', () => {});
  $registerForm.addEventListener('submit', registPost);
};

const init = () => {
  bindEvents();
};

window.addEventListener('DOMContentLoaded', init);
