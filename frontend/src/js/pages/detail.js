import header from '../components/header';
import { $, $parent } from '../helpers/utils';
import {
  getPostInfo,
  getPostComments,
  getIsUserLogin,
  postComment,
  updateComment,
  deleteComment,
  deletePost,
} from '../requests';
import { moveToPage } from '../router';

const $commentTextInput = $('.detail__comment-input-tag');
const $commentSubmitButton = $('.detail__comment-submit');
const $carouselSliderMultiImg = $('.carousel__multi');
const $carouselSliderSingleImg = $('.carousel__single');

let $commentInput = null;
let $editConfirmButton = null;
let $commentEditInput = null;
const postId = history.state.path.split('/')[2];

const commentRender = (user, comments) => {
  $('.detail__comment-num').textContent = `댓글 ${comments.length} 개`;
  $('.detail__comment-list').innerHTML = comments
    .map(
      comment =>
        `
        <li data-id="${comment.id}" class="detail__comment-li">
          <span class="detail__comment-writer">${comment.writerNickname}</span>
          <span class="detail__comment-date">${comment.createdAt}</span>
          <label for="detail__comment-content" class=" sr-only">댓글</label>
          <p class="detail__comment-content">${comment.content}</p>
          <textarea
          name="detail__comment-edit-content" 
          id="detail__comment-edit-content"
          class="detail__comment-edit-content hidden"
          cols="30"
          rows="5">${comment.content.replaceAll('<br>', '\n')}</textarea>
          ${
            user?.id
              ? user.nickname === comment.writerNickname
                ? `
                <div class="comment-edit-del">
                  <button class="comment-edit-btn">수정</button>
                  <span class="comment-bar"> | </span>
                  <button class="comment-del-btn">삭제</button>
                </div>
                  `
                : ''
              : ''
          }
          <button class="comment-edit-confirm-btn hidden">수정하기</button>
        </li>
  `
    )
    .join('');
};

const addComment = async (user, content) => {
  try {
    const { data: comments } = await postComment(postId, user.id, content);
    commentRender(user, comments);
  } catch (error) {
    console.error(error);
  }
};

const carouselSlide = imageList => {
  const SLIDE_DURATION = 250;
  let maxCarouselSlide,
    canSlide = true;

  const renderCarousel = (imageList, isSingleImage) => {
    if (isSingleImage) {
      $carouselSliderMultiImg.classList.add('hidden');

      $carouselSliderSingleImg.innerHTML += `
      <div class="detail__img" style="background-image : url(${imageList[0]});" ></div>
      `;
    }

    if (!isSingleImage) {
      $carouselSliderSingleImg.classList.add('hidden');

      imageList.forEach(img => {
        $carouselSliderMultiImg.innerHTML += `
           <div class="detail__img" style="background-image : url(${img});" ></div>`;
      });

      $('.carousel__prev-next').innerHTML += `
          <button class="carousel__prev" type="button">
            <i class="fas fa-chevron-left fa-2x"></i>
          </button>
          <button class="carousel__next" type="button">
          <i class="fas fa-chevron-right fa-2x"></i>
          </button>
      `;
    }
  };
  // 업로드한 이미지가 한 개 일 때
  if (imageList.length === 1) {
    renderCarousel(imageList, true);
  } else {
    const imageListForCarousel = [imageList[imageList.length - 1], ...imageList, imageList[0]];
    maxCarouselSlide = imageListForCarousel.length - 1;
    renderCarousel(imageListForCarousel, false);
  }

  const setCarouselStyle = (currentSlide, duration) => {
    $carouselSliderMultiImg.style.setProperty('--currentSlide', currentSlide);
    $carouselSliderMultiImg.style.setProperty('--duration', duration);
  };

  let currentSlide = +getComputedStyle($carouselSliderMultiImg).getPropertyValue('--currentSlide');

  $carouselSliderMultiImg.addEventListener('transitionend', () => {
    if (currentSlide < maxCarouselSlide && currentSlide > 0) return;

    if (currentSlide >= maxCarouselSlide) currentSlide = 1;
    if (currentSlide <= 0) currentSlide = maxCarouselSlide - 1;

    setCarouselStyle(currentSlide, 0);
  });

  $('.carousel__prev-next').addEventListener('click', ({ target }) => {
    if (canSlide) {
      canSlide = false;
      setTimeout(() => {
        canSlide = true;
      }, SLIDE_DURATION + 50);

      if (target.classList.contains('carousel__prev')) {
        currentSlide -= 1;
      }
      if (target.classList.contains('carousel__next')) {
        currentSlide += 1;
      }
      setCarouselStyle(currentSlide, SLIDE_DURATION);
    }
  });
};

const bindEvents = async () => {
  const user = await header.bindEvents();

  $commentSubmitButton.addEventListener('click', () => {
    if (!$commentTextInput.value) return;
    addComment(user, $commentTextInput.value.trim().replaceAll('\n', '<br>'));
    $commentTextInput.value = '';
  });

  $('.detail__comment-list').addEventListener('click', async ({ target }) => {
    // 수정 클릭
    if (target.classList.contains('comment-edit-btn')) {
      $commentInput = $parent(target.parentElement, '.detail__comment-content');
      $editConfirmButton = $parent(target.parentElement, '.comment-edit-confirm-btn');
      $commentEditInput = $parent(target.parentElement, '.detail__comment-edit-content');

      $commentInput.classList.add('hidden');
      $commentEditInput.classList.remove('hidden');
      $editConfirmButton.classList.remove('hidden');
      $parent(target.parentElement, '.comment-edit-del').classList.add('hidden');
    }

    // 수정완료했을 때
    if (target.classList.contains('comment-edit-confirm-btn')) {
      const { id: commentId } = target.parentElement.dataset;
      const { value: commentValue } = $parent(target, '.detail__comment-edit-content');
      try {
        const { data: comments } = await updateComment(commentId, commentValue.trim().replaceAll('\n', '<br>'));
        commentRender(user, comments);

        $commentInput.classList.remove('hidden');
        $commentEditInput.classList.add('hidden');
        target.classList.add('hidden');
        $parent(target, '.comment-edit-del').classList.remove('hidden');
      } catch (error) {
        console.error(error);
      }
    }

    // 삭제했을 때
    if (target.classList.contains('comment-del-btn')) {
      const { id: commentId } = target.parentElement.parentElement.dataset;

      if (confirm('댓글을 정말 삭제하시겠습니까?')) {
        try {
          const { data: comments } = await deleteComment(postId, commentId);
          commentRender(user, comments);
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  $('.detail__posting-edit-del').addEventListener('click', async e => {
    if (!e.target.matches('button')) return;

    if (e.target.matches('.posting-edit-btn')) {
      moveToPage(`/update/${postId}`);
    }
    if (e.target.matches('.posting-del-btn')) {
      try {
        if (confirm('게시글을 정말 삭제하시겠습니까?')) {
          try {
            await deletePost(postId);
            alert('게시글 삭제 완료!');
            moveToPage('/');
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
};

const fetchPostData = async id => {
  const {
    data: { user },
  } = await getIsUserLogin();
  try {
    const { data: post } = await getPostInfo(id);
    const { data: commentList } = await getPostComments(post.comments);

    $('.detail__info').innerHTML = `
      <span class="detail__info-title">${post.title}</span>
      <div class="detail__info-container">
        <div class="detail__info-writer">${post.writer}</div>
        <div class="detail__info-date">${post.createdAt}</div>
      </div>
    `;

    if (post.images.length) {
      carouselSlide(post.images);
    } else {
      $carouselSliderMultiImg.classList.add('hidden');
      $('.carousel__img-container').innerHTML += `
        <div class="detail__img" style="background-image : url(https://web.yonsei.ac.kr/_ezaid/board/_skin/albumRecent/1/no_image.gif);" ></div>`;
    }
    $('.post__detail-list').innerHTML = `
      <div class="detail__etc-info">
        <span class="detail__city">${post.city} ${post.district}</span>
        <span class="detail__animal species-${
          post.animal === '강아지' ? 'dog' : post.animal === '고양이' ? 'cat' : 'etc'
        }">${post.animal}</span>
        <span class="detail__type">${post.type}</span>
      </div>
      <div class="detail__posting-content">${post.content}</div>
    `;

    if (post.type === '') $('.detail__type').classList.add('hidden');

    $('.detail__comment-num').textContent = `댓글 ${post.comments.length} 개`;

    commentRender(user, commentList);

    if (!user?.id) {
      $commentTextInput.setAttribute('placeholder', '로그인 후 이용하세요.');
      $commentTextInput.setAttribute('disabled', true);
      $commentSubmitButton.setAttribute('disabled', true);
    } else {
      if (user.nickname === post.writer) {
        $('.detail__posting-edit-del').innerHTML = `
        <button class="posting-edit-btn">수정</button>
        <button class="posting-del-btn">삭제</button>
      `;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const init = () => {
  bindEvents();

  const urlpath = location.href.split('/');
  const postid = urlpath[urlpath.length - 1];
  fetchPostData(postid);
};

window.addEventListener('DOMContentLoaded', init);
