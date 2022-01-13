import header from '../components/header';
import { $ } from '../helpers/utils';
import { handleHistory } from '../router';
import { getPostInfo, getPostwriter } from '../requests';

const bindEvents = () => {
  header.bindEvents();

  window.addEventListener('popstate', handleHistory);
};

const fetchPostData = async id => {
  try {
    const {
      data: [post],
    } = await getPostInfo(id);
    const {
      data: [user],
    } = await getPostwriter(post.userId);
    // const res = await getWriterAndComment(post.userId, post.comments);

    $('.detail__info').innerHTML = `
      <span class="detail__info-title">${post.title}</span>
      <div class="detail__info-container">
        <span class="detail__info-writer">${user.nickname}</span>
        <span class="detail__info-date">${post.createdAt}</span>
      </div>
    `;
    post.images.map(
      (img, current) =>
        ($('.carousel__img-container').innerHTML += `<img class="detail__img" src="${img}" alt="이미지${
          current + 1
        }" />`)
    );
    $('.post__detail-list').innerHTML = `
      <span class="detail__city">${post.city} ${post.district}</span>
      <span class="detail__animal">${post.animal}</span>
      <div clss="detail__posting-content">${post.content}</div>
    `;

    $('.detail__comment-num').textContent = `댓글 ${post.comments.length} 개`;
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
