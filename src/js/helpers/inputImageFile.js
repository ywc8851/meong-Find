import { $ } from './utils';
import { postUploadImages } from '../requests';

const $inputFile = $('.register-upload__input');
const $imagePreview = $('.register-preview');
const $registerUpload = $('.register-upload');

let images = [];

const createImage = (url, index) =>
  `<div class="register-preview-image" style="background-image: url(${URL.createObjectURL(url)})">
    <button type="button" class="register-preview-image__delete">
      <i class="fas fa-times-circle fa-2x" data-index="${index}"></i>
    </button>
  </div>`;

const renderImage = () => {
  $imagePreview.innerHTML = images.map((image, i) => createImage(image, i)).join();
};

export const addImage = newImages => {
  images = [...images, ...newImages];
  renderImage();
};

export const deleteImage = ({ target }) => {
  if (!target.matches('.fas.fa-times-circle')) return;
  images = images.filter((_, index) => index !== +target.dataset.index);
  renderImage();
};

export const handleInputFile = () => {
  const newImages = $inputFile.files;
  if (newImages.length > 4) {
    const _newImages = [];
    for (let i = 0; i < 4; i++) {
      _newImages.push(newImages[i]);
    }
    addImage(_newImages);
    return alert('이미지는 4장까지만 업로드 할 수 있습니다.');
  }
  if (!newImages[0]) return;
  addImage(newImages);
};

export const handleDrag = event => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

export const handleDrop = event => {
  event.stopPropagation();
  event.preventDefault();
  const imageFiles = event.dataTransfer.files;
  addImage(imageFiles);
};

export const uploadImage = async () => {
  const formData = new FormData();
  images.forEach(image => formData.append('img', image));
  try {
    const {
      data: { success, files },
    } = await postUploadImages(formData);

    if (!success) {
      return alert('포스트가 정상적으로 등록되지 않았습니다.\n다시 한번 포스팅 해주세요.');
    }
    return files;
  } catch (error) {
    console.error(error);
  }
};

export const bindImageEvents = () => {
  $inputFile.addEventListener('change', handleInputFile);
  $imagePreview.addEventListener('click', deleteImage);
  $registerUpload.addEventListener('dragover', handleDrag);
  $registerUpload.addEventListener('drop', handleDrop);
};
