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
      $('.detail__comment-list').innerHTML += `
      <li>
        <span class="detail__comment-writer">${comment.writerNickname}</span>
        <span class="detail__comment-content">${comment.content}</span>
        ${
          user?.id
            ? user.nickname === comment.writerNickname
              ? `<button class="comment-edit-btn">수정</button>
                <button class="comment-del-btn">삭제</button>`
              : ``
            : ''
        }
      </li>
    `;
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
      // addcomment 함수 실행
      addComment($commentInput.value);

      $commentInput.value = '';
    });
    $commentSubmitButton.addEventListener('click', async () => {
      if (!$commentInput.value) return;

      addComment($commentInput.value);
      // addcomment 함수 실행
    });

    // 작성자 정보 모두 받아서 Post 해준다.
    const addComment = async comment => {
      try {
        const res = await postComment(post.id, user.id, comment);
        if (res.status === 200) {
          $('.detail__comment-list').innerHTML += `
            <li>
            <span class="detail__comment-writer">${user.nickname}</span>
            <span class="detail__comment-content">${comment}</span>
            ${
              user?.id
                ? user.nickname === comment.writerNickname
                  ? `<button class="comment-edit-btn">수정</button>
                    <button class="comment-del-btn">삭제</button>`
                  : ``
                : ''
            }
          </li>
        `;
        } else {
          alert('댓글 추가에 실패했습니다');
        }
      } catch (error) {
        console.error(error);
      }
    };
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
