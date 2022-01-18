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
let $commentInput = null;
let $commentEditButton = null;
let $commentDeleteButton = null;
let $editConfirmButton = null;

const postId = history.state.path.split('/')[2];

const commentRender = (user, comments) => {
  $('.detail__comment-list').innerHTML = comments
    .map(
      comment =>
        `
        <li data-id="${comment.id}" class="detail__comment-li">
          <span class="detail__comment-writer">${comment.writerNickname}</span>
          <label for="detail__comment-content" class=" sr-only">댓글</label>
          <input id="detail__comment-content" class="detail__comment-content" type="text" value="${
            comment.content
          }" disabled />
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

const bindEvents = async () => {
  const user = await header.bindEvents();

  $commentTextInput.addEventListener('keydown', ({ key, isComposing }) => {
    const content = $commentTextInput.value.trim();

    if (key !== 'Enter' || content === '' || isComposing) return;
    addComment(user, content);

    $commentTextInput.value = '';
  });

  $commentSubmitButton.addEventListener('click', () => {
    if (!$commentTextInput.value) return;
    addComment(user, $commentTextInput.value.trim());
    $commentTextInput.value = '';
  });

  $('.detail__comment-list').addEventListener('keydown', async ({ target, key, isComposing }) => {
    if (!target.matches('.detail__comment-content')) return;
    if (key !== 'Enter' || target.value === '' || isComposing) return;

    const { id: commentId } = target.parentElement.dataset;
    const commentValue = target.value.trim();

    try {
      $editConfirmButton = $parent(target, '.comment-edit-confirm-btn');

      target.setAttribute('disabled', true);
      $parent(target, '.comment-edit-del').classList.remove('hidden');
      $editConfirmButton.classList.add('hidden');
      await updateComment(commentId, commentValue);
    } catch (error) {
      console.error(error);
    }
  });

  $('.detail__comment-list').addEventListener('click', async ({ target }) => {
    // 수정 클릭
    if (target.classList.contains('comment-edit-btn')) {
      $commentInput = $parent(target.parentElement, '.detail__comment-content');
      $editConfirmButton = $parent(target.parentElement, '.comment-edit-confirm-btn');
      $commentInput.removeAttribute('disabled');
      $editConfirmButton.classList.remove('hidden');
      $parent(target.parentElement, '.comment-edit-del').classList.add('hidden');
    }

    // 수정완료했을 때
    if (target.classList.contains('comment-edit-confirm-btn')) {
      const { id: commentId } = target.parentElement.dataset;
      const { value: commentValue } = $parent(target, '.detail__comment-content');
      try {
        await updateComment(commentId, commentValue);
        $commentInput.setAttribute('disabled', true);
        $parent(target, '.comment-edit-del').classList.remove('hidden');
        target.classList.add('hidden');
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

    // 작성자 정보 모두 받아서 Post 해준다.

    $('.detail__info').innerHTML = `
      <span class="detail__info-title">${post.title}</span>
      <div class="detail__info-container">
        <div class="detail__info-writer">${post.writer}</div>
        <div class="detail__info-date">${post.createdAt}</div>
      </div>
    `;

    post.images.forEach((img, current) => {
      $('.carousel__img-container').innerHTML += `
      <div class="detail__img" style="background-image : url(${img});" ></div>`;
    });

    $('.post__detail-list').innerHTML = `
      <div class="detail__etc-info">
        <span class="detail__city">${post.city} ${post.district}</span>
        <span class="detail__animal species-${
          post.animal === '강아지' ? 'dog' : post.animal === '고양이' ? 'cat' : 'etc'
        }">${post.animal}</span>
      </div>
      <div class="detail__posting-content">${post.content}</div>
    `;

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
