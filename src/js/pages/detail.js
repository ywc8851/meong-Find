import header from '../components/header';
import { $ } from '../helpers/utils';
import { handleHistory } from '../router';
import { getPostInfo, getPostComments, getIsUserLogin, postComment } from '../requests';

const $commentInput = $('.detail__comment-input-tag');
const $commentSubmitButton = $('.detail__comment-submit');

const postId = history.state.path.split('/')[2];

const commentRender = (user, comments) => {
  $('.detail__comment-list').innerHTML = comments
    .map(
      comment =>
        `
        <li data-id="${comment.id}" class="comment-li">
          <span class="detail__comment-writer">${comment.writerNickname}</span>
          <label for="detail__comment-content" class=" sr-only">댓글</label>
          <input id="detail__comment-content" class="detail__comment-content" type="text" value="${
            comment.content
          }" disabled />
          ${
            user?.id
              ? user.nickname === comment.writerNickname
                ? `<button class="comment-edit-btn">수정</button>
                  <button class="comment-del-btn">삭제</button>`
                : ''
              : ''
          }
          <button class="comment-edit-confirm-btn hidden">확인</button>
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

  $commentTextInput.addEventListener('keyup', ({ key }) => {
    if (key !== 'Enter') return;

    const content = $commentTextInput.value.trim();

    if (key !== 'Enter' || content === '') {
      return;
    }
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
      target.setAttribute('disabled', true);
      $parent(target, '.comment-edit-btn').classList.remove('hidden');
      $parent(target, '.comment-del-btn').classList.remove('hidden');
      $parent(target, '.comment-edit-confirm-btn').classList.add('hidden');

      await updateComment(commentId, commentValue);
    } catch (error) {
      console.error(error);
    }
  });

  $('.detail__comment-list').addEventListener('click', async ({ target }) => {
    if (target.classList.contains('comment-edit-btn')) {
      $commentInput = $parent(target, '.detail__comment-content');
      $commentEditButton = $parent(target, '.comment-edit-btn');
      $commentDeleteButton = $parent(target, '.comment-del-btn');
      $editConfirmButton = $parent(target, '.comment-edit-confirm-btn');

      $commentInput.removeAttribute('disabled');
      $editConfirmButton.classList.remove('hidden');
      $commentEditButton.classList.add('hidden');
      $commentDeleteButton.classList.add('hidden');
      // console.log(commentid);
    }
    // 수정완료했을 때
    if (target.classList.contains('comment-edit-confirm-btn')) {
      const { id: commentId } = target.parentElement.dataset;
      const { value: commentValue } = $parent(target, '.detail__comment-content');

      try {
        await updateComment(commentId, commentValue);
        $parent(target, '.detail__comment-content').setAttribute('disabled', true);
        $parent(target, '.comment-edit-btn').classList.remove('hidden');
        $parent(target, '.comment-del-btn').classList.remove('hidden');
        target.classList.add('hidden');
      } catch (error) {
        console.error(error);
      }
    }
    // 삭제했을 때
    if (target.classList.contains('comment-del-btn')) {
      const { id: commentId } = target.parentElement.dataset;

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
    const addComment = async content => {
      try {
        const { data: comment } = await postComment(post.id, user.id, content);
        commentRender({ ...comment, writerNickname: user.nickname });
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
      if (target.classList.contains('comment-edit-btn')) {
        const $commentInput = target.parentElement.querySelector('.detail__comment-content');
        const $commentEditButton = target.parentElement.querySelector('.comment-edit-btn');
        const $commentDeleteButton = target.parentElement.querySelector('.comment-del-btn');
        const $editConfirmButton = target.parentElement.querySelector('.comment-edit-confirm-btn');

        $commentInput.removeAttribute('disabled');
        $editConfirmButton.classList.remove('hidden');
        $commentEditButton.classList.add('hidden');
        $commentDeleteButton.classList.add('hidden');
        // console.log(commentid);
      }
      // 수정완료했을 때
      if (target.classList.contains('comment-edit-confirm-btn')) {
        // await updateComment({})
        target.parentElement.querySelector('.detail__comment-content').setAttribute('disabled', true);
        target.parentElement.querySelector('.comment-edit-btn').classList.remove('hidden');
        target.parentElement.querySelector('.comment-del-btn').classList.remove('hidden');
        target.classList.add('hidden');
      }
      // 삭제했을 때
      if (target.classList.contains('comment-del-btn')) {
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
