import header from '../components/header';
import { handleHistory } from '../router';
import { getMyProfile } from '../requests';
import { $ } from '../helpers/utils';

const render = (() => {
  window.onload = async () => {
    try {
      const { data: user } = await getMyProfile();
      if (user) {
        $('.profile__title-container').innerHTML = `
          <span>${user[0].nickname}</span>
          <span class="bold">님의 프로필</span>
        `;

        $('.profile__email-container').innerHTML = `
        <span class="profile__email-title">이메일</span>
        <span class="profile__email">${user[0].email}</span>
        `;

        $('.profile__city-container').innerHTML = `
          <span class="profile__city-title">지 역</span>
          <span class="profile__city">${user[0].city}</span>
          <span class="profile__district">${user[0].district}</span>
        `;
      }
    } catch (e) {
      console.error(e);
    }
  };
})();
