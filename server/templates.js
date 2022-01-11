const signIn = `<section class="sign-in">
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
      <button type="submit" class="sign-in-btn">로그인</button>
      <button class="sign-up-link">
        <a href="#">회원가입하러 가기</a>
      </button>
    </div>
  </fieldset>
</form>
</section>`;

module.exports = { signIn };
