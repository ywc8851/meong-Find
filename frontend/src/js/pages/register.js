import header from '../components/header';
import { $ } from '../helpers/utils';
import { handleSelectOptions } from '../helpers/select';
import { bindImageEvents, uploadImage, setImages } from '../helpers/inputImageFile';
import { addNewPost, updatePost, getPostInfo } from '../requests';
import { moveToPage } from '../router';

const $inputFile = $('.register-upload__input');
const $registerUpload = $('.register-upload');
const $registerForm = $('.register-form');
const $city = $('#city');
const $district = $('#district');
const $title = $('.register-title-input');
const $titleLength = $('.register-title__length__filled');
const $content = $('.register-textcontent__content');
const $contentLength = $('.register-textcontent__length__filled');
const $animalType = $('#animalType');

const LIMIT = {
  TITLE: 50,
  CONTENT: 1000,
};

const inputs = {
  title: '제목',
  content: '글 본문',
};

let isEdit = false;

let state = {
  title: '',
  images: [],
  city: '',
  district: '',
  animal: $('#animal').value,
  type: '',
  content: '',
  writerId: '',
};

const limitInputLength = ({ type, value, $input, $inputLength }) => {
  if (value.length > LIMIT[type]) {
    $input.value = value.slice(0, LIMIT[type]);
    $inputLength.innerText = LIMIT[type];
    return alert(`본문은 ${LIMIT[type]}자 이내로 입력해주세요.`);
  }
};

const checkEmptyInput = () => {
  for (const [key, value] of Object.entries(state)) {
    if (key === 'type') continue;
    if (key !== 'images' && value === '') {
      alert(`${inputs[key]}의 값을 입력해주세요.`);
      return true;
    }
  }
  return false;
};

const registPost = async e => {
  e.preventDefault();
  try {
    const images = await uploadImage();
    state.images = images.map(image => (typeof image === 'object' ? `../img/${image.filename}` : image));

    state.title = state.title.trim();
    state.type = state.type.trim();
    state.content = state.content.trim().replaceAll('\n', '<br>');

    const hasEmptyInput = checkEmptyInput();
    if (hasEmptyInput) return;

    const {
      data: { id },
    } = isEdit ? await updatePost(state) : await addNewPost(state);

    alert(`포스트가 ${isEdit ? '수정' : '등록'}되었습니다.`);
    moveToPage(`/post/${id}`);
  } catch (error) {
    console.error(error);
  }
};

const setSelectOptionByUser = ({ id, city, district }) => {
  state.writerId = id;
  state.city = city;
  state.district = district;

  $city.value = city;
  handleSelectOptions({ $city, $district });
  $district.value = district;
};

const setValueByUser = async user => {
  if (sessionStorage.getItem('isEditingPost')) {
    isEdit = true;
    $('.register-edit-btn').classList.remove('hidden');
    $('.register-submit-btn').classList.add('hidden');

    const postId = history.state.path.split('/')[2];
    const { data: post } = await getPostInfo(postId);

    $title.value = post.title;
    $city.value = post.city;
    handleSelectOptions({ $city, $district });

    $district.value = post.district;
    $animalType.value = post.type;
    $content.value = post.content.replaceAll('<br>', '\n');

    setImages(post.images);

    $titleLength.innerText = post.title.length;
    $contentLength.innerText = post.content.length;
    state = { ...post };
  } else setSelectOptionByUser(user);
};

const bindEvents = async () => {
  const user = await header.bindEvents();
  await setValueByUser(user);
  bindImageEvents();

  $registerUpload.addEventListener('click', () => {
    $inputFile.click();
  });

  $('.register-title-input').addEventListener('keyup', ({ target: { value } }) => {
    $titleLength.innerText = value.length;
    limitInputLength({ type: 'TITLE', value, $input: $title, $inputLength: $titleLength });
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

  $animalType.addEventListener('keyup', ({ target: { value } }) => {
    state.type = value;
  });

  $('.register-textcontent__content').addEventListener('keyup', ({ target: { value } }) => {
    $contentLength.innerText = value.length;
    limitInputLength({ type: 'CONTENT', value, $input: $content, $inputLength: $contentLength });
    state.content = value;
  });

  $registerForm.addEventListener('submit', registPost);
};

window.addEventListener('DOMContentLoaded', bindEvents);
