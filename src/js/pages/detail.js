import header from '../components/header';
import { $ } from '../helpers/utils';
import { handleHistory } from '../router';
import { getPostInfo, getPostComments, getIsUserLogin, postComment } from '../requests';

const $commentInput = $('.detail__comment-input-tag');
const $commentSubmitButton = $('.detail__comment-submit');

const bindEvents = () => {
  header.bindEvents();

  window.addEventListener('popstate', handleHistory);
};

const fetchPostData = async id => {
  const {
    data: { user },
  } = await getIsUserLogin();
  try {
    const { data: post } = await getPostInfo(id);
    const { data: commentList } = await getPostComments(post.comments);

    const commentRender = comment => {
      $('.detail__comment-list').innerHTML += `
        <li data-id="${comment.id}" class="comment-li">
          <span class="detail__comment-writer">${comment.writerNickname}</span>
          <label for="detail__comment-content sr-only">댓글</label>
          <input id="detail__comment-content" class="detail__comment-content" type="text" value="${
            comment.content
          }" disabled />
          ${
            user?.id
              ? user.nickname === comment.writerNickname
                ? `<button class="comment-edit-btn">수정</button>
                  <button class="comment-del-btn">삭제</button>`
                : ``
              : ''
          }
          <button class="comment-edit-confirm-btn hidden">확인</button>
        </li>
      `;
    };
    // 작성자 정보 모두 받아서 Post 해준다.
    const addComment = async comment => {
      try {
        const { data: comment } = await postComment(post.id, user.id, comment);
        console.log(comment);
        commentRender(comment);
      } catch (error) {
        console.error(error);
      }
    };

    $('.detail__info').innerHTML = `
      <span class="detail__info-title">${post.title}</span>
      <div class="detail__info-container">
        <div class="detail__info-writer">${post.writer}</div>
        <div class="detail__info-date">${post.createdAt}</div>
      </div>
    `;

    post.images.forEach((img, current) => {
      $('.carousel__img-container').innerHTML += `
        <img class="detail__img" src="${img}" alt="이미지${current + 1}" />`;
    });

    $('.post__detail-list').innerHTML = `
      <span class="detail__city">${post.city} ${post.district}</span>
      <span class="detail__animal species-${
        post.animal === '강아지' ? 'dog' : post.animal === '고양이' ? 'cat' : 'etc'
      }">${post.animal}</span>
      <div clss="detail__posting-content">${post.content}</div>
    `;

    $('.detail__comment-num').textContent = `댓글 ${post.comments.length} 개`;

    commentList.forEach(comment => {
      commentRender(comment);
    });

    if (!user?.id) {
      $commentInput.setAttribute('placeholder', '로그인 후 이용하세요.');
      $commentInput.setAttribute('disabled', true);
      $commentSubmitButton.setAttribute('disabled', true);
    } else {
      if (user.nickname === post.writer) {
        $('.detail__posting-edit-del').innerHTML = `
        <button class="posting-edit-btn">수정</button>
        <button class="posting-del-btn">삭제</button>
      `;
      }
    }

    // 이벤트 모음집 ~
    $commentInput.addEventListener('keypress', ({ key }) => {
      if (key !== 'Enter') return;

      const content = $commentInput.value.trim();

      if (key !== 'Enter' || content === '') {
        return;
      }
      addComment($commentInput.value);
      $commentInput.value = '';
    });

    $commentSubmitButton.addEventListener('click', () => {
      if (!$commentInput.value) return;

      addComment($commentInput.value);
    });

    $('.detail__comment-list').addEventListener('click', ({ target }) => {
      // 수정 버튼을 눌렀을 때
      console.log(target);
      if (target.classList.contains('comment-edit-btn')) {
        console.log(2);
        const $commentInput = target.parentElement.querySelector('.detail__comment-content');
        const $commentEditButton = target.parentElement.querySelector('.comment-edit-btn');
        const $commentDeleteButton = target.parentElement.querySelector('.comment-del-btn');
        const $editConfirmButton = target.parentElement.querySelector('.comment-edit-confirm-btn');

        $commentInput.removeAttribute('disabled');
        $editConfirmButton.classList.remove('hidden');
        $commentEditButton.classList.add('hidden');
        $commentDeleteButton.classList.add('hidden');
      }
      // 수정완료했을 때
      if (target.classList.contains('comment-edit-confirm-btn')) {
        // console.log(target.parentElement.querySelector('.detail__comment-content').value);

        target.parentElement.querySelector('.detail__comment-content').setAttribute('disabled', true);
        target.parentElement.querySelector('.comment-edit-btn').classList.remove('hidden');
        target.parentElement.querySelector('.comment-del-btn').classList.remove('hidden');
        target.classList.add('hidden');
      }
      // 삭제했을 때
      if (target.classList.contains('comment-del-btn')) {
        console.log(2);
      }
    });
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
//
