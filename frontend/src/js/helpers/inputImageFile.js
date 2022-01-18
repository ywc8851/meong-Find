import { $ } from './utils';
import { postUploadImages } from '../requests';

const $inputFile = $('.register-upload__input');
const $imagePreview = $('.register-preview');
const $registerUpload = $('.register-upload');

let images = [];

const createImage = (image, index) =>
  `<div class="register-preview-image" style="background-image: url(${
    typeof image === 'object' ? URL.createObjectURL(image) : image
  })">
    <button type="button" class="register-preview-image__delete">
      <i class="fas fa-times-circle fa-2x" data-index="${index}"></i>
    </button>
  </div>`;

const renderImage = () => {
  $imagePreview.innerHTML = images.map((image, i) => createImage(image, i)).join();
};

const restrictImages = _images => {
  if (images.length + _images.length > 4) {
    const _newImages = [];
    for (let i = 0; i < 4 - images.length; i++) {
      _newImages.push(_images[i]);
    }
    alert('이미지는 4장까지만 업로드 할 수 있습니다.');
    return _newImages;
  } else return _images;
};

const addImage = newImages => {
  images = [...images, ...restrictImages(newImages)];
  renderImage();
};

const deleteImage = ({ target }) => {
  if (!target.matches('.fas.fa-times-circle')) return;
  images = images.filter((_, index) => index !== +target.dataset.index);
  renderImage();
};

export const setImages = newImages => {
  images = newImages;
  renderImage();
};

const handleInputFile = () => {
  const newImages = $inputFile.files;
  if (!newImages[0]) return;
  addImage(newImages);
};

const handleDrag = event => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

const handleDrop = event => {
  event.stopPropagation();
  event.preventDefault();
  const imageFiles = event.dataTransfer.files;
  addImage(imageFiles);
};

export const uploadImage = async () => {
  const formData = new FormData();
  const uploadedImages = [];
  images.forEach(image => (typeof image === 'object' ? formData.append('img', image) : uploadedImages.push(image)));
  try {
    const {
      data: { success, files },
    } = await postUploadImages(formData);

    if (!success) {
      return alert('포스트가 정상적으로 등록되지 않았습니다.\n다시 한번 포스팅 해주세요.');
    }
    return [...files, ...uploadedImages];
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
