const signIn = `
<section class="sign-in">
  <h2 class="sign-title">로그인</h2>
  <form class="sign-in-form">
    <fieldset>
      <legend class="sr-only">로그인 폼</legend>
      <div class="sign-in-form-info sign-in-form-email">
        <label for="email" class="sign-in-form-label">이메일</label>
        <input id="email" type="email" class="sign-in-form-input" required />
        <i class="fas fa-check-circle fa-lg hidden"></i>
        <i class="fas fa-times-circle fa-lg hidden"></i>
        <div class="error"></div>
      </div>
      <div class="sign-in-form-info sign-in-form-password">
        <label for="password" class="sign-in-form-label">비밀번호</label>
        <input id="password" type="password" class="sign-in-form-input" required />
        <i class="fas fa-check-circle fa-lg hidden"></i>
        <i class="fas fa-times-circle fa-lg hidden"></i>
        <div class="error"></div>
      </div>
      <div class="sign-in-form-auto-find">
        <div class="auto-login">
          <input type="checkbox" id="auto__login" name="login" />
          <label for="auto__login">자동 로그인</label>
        </div>
        <button class="find-password">비밀번호 찾기</button>
      </div>
      <div class="sign-in-form-btns">
        <button disabled type="submit" class="sign-in-btn">로그인</button>
        <button class="sign-up-link">
          <a href="#">회원가입하러 가기</a>
        </button>
      </div>
    </fieldset>
  </form>
</section>`;

const signUp = `
<section class="sign-up">
<h2 class="sign-title">회원가입</h2>
<form class="sign-up-form">
  <fieldset>
    <legend class="sr-only">회원가입 폼</legend>
    <div class="sign-up-form-info sign-up-form-name">
      <label for="nickname" class="sign-up-form-label">닉네임</label>
      <input id="nickname" class="sign-up-form-input" type="text" maxlength="10" required />
      <button class="check-duplicated sign-up-form__nickname-btn" disabled>중복확인</button>
      <i class="fas icon-success fa-check-circle fa-lg hidden"></i>
      <i class="fas icon-error fa-times-circle fa-lg hidden"></i>
      <div class="error"></div>
    </div>

    <div class="sign-up-form-info sign-up-form-email">
      <label for="email" class="sign-up-form-label">이메일</label>
      <input id="email" class="sign-up-form-input" type="email" required />
      <button class="check-duplicated sign-up-form__email-btn" disabled>중복확인</button>
      <i class="fas icon-success fa-check-circle fa-lg hidden"></i>
      <i class="fas icon-error fa-times-circle fa-lg hidden"></i>
      <div class="error"></div>
    </div>
    <div class="sign-up-form-info sign-up-form-password">
      <label for="password" class="sign-up-form-label">비밀번호</label>
      <input id="password" class="sign-up-form-input" type="password" required />
      <i class="fas icon-success fa-check-circle fa-lg hidden"></i>
      <i class="fas icon-error fa-times-circle fa-lg hidden"></i>
      <div class="error"></div>
    </div>
    <div class="sign-up-form-info sign-up-form-repassword">
      <label for="repassword" class="sign-up-form-label">비밀번호 확인</label>
      <input id="repassword" class="sign-up-form-input" type="password" required />
      <i class="fas icon-success fa-check-circle fa-lg hidden"></i>
      <i class="fas icon-error fa-times-circle fa-lg hidden"></i>
      <div class="error"></div>
    </div>
    <div class="sign-up-form-info sign-up-form-area">
      <label for="area">지역 선택</label>
      <div id="area">
        <select name="city" id="city">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
          <option value="goldfish">Goldfish</option>
        </select>
        <select name="district" id="district">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
          <option value="goldfish">Goldfish</option>
        </select>
      </div>
    </div>
    <button class="sign-up-btn" disabled>회원가입</button>
  </fieldset>
</form>
</section>
`;

module.exports = { signIn, signUp };
