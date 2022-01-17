import axios from 'axios';

export const fetchHtml = async url => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};

export const getSearchTitle = async searchValue => {
  try {
    return await axios.get(`/search/${searchValue}`);
  } catch (error) {
    console.error(error);
  }
};
export const getSignUpForm = async () => {
  try {
    return await axios.get('/signup');
  } catch (error) {
    console.error(error);
  }
};

export const getSignUpEmail = async emailValue => {
  try {
    return await axios.get(`/user/email/${emailValue}`);
  } catch (error) {
    console.error(error);
  }
};

export const getSignUpName = async nickname => {
  try {
    return await axios.get(`/user/name/${nickname}`);
  } catch (error) {
    console.error(error);
  }
};

// 회원가입 정보 전송
export const getSignup = async (nickname, email, password, city, district) => {
  try {
    return await axios.post('/users/signup', {
      nickname,
      email,
      password,
      city,
      district,
    });
  } catch (error) {
    console.error(error);
  }
};

export const postSignIn = async (email, password, autoLogin) => {
  try {
    return await axios.post('/user/signin', { email, password, autoLogin });
  } catch (error) {
    console.error(error);
  }
};

export const getSignOut = async () => {
  try {
    return await axios.get('/user/signout');
  } catch (error) {
    console.error(error);
  }
};

// main page posting 관리
export const getMainPosts = async () => {
  try {
    return await axios.get('/getposts');
  } catch (error) {
    console.error(error);
  }
};

// select에 따른 글찾기
export const findPosts = async (city, district, animal) => {
  return await axios.get(`/findposts/${city}/${district}/${animal}`);
};

export const searchTitile = async title => {
  return await axios.get(`/findposts/${title}`);
};

// 이메일 주소로 아이디 찾기
export const getUserId = async email => {
  return await axios.get(`/user/id/${email}`);
};

// 발급 받은 임시 비밀번호로 변경
export const changePassword = async (id, password) => {
  try {
    return await axios.patch('/user/temporary', { id, password });
  } catch (error) {
    console.error(error);
  }
};

// 상세페이지 posting 정보 가져오기
export const getPostInfo = async id => {
  try {
    return await axios.get(`/detail/${id}`);
  } catch (error) {
    console.log(error);
  }
};
// 상세페이지 - 작성자 가져오기
// export const getPostWriter = async writerId => {
//   try {
//     console.log(1);
//     return await axios.get(`/detail/user/${writerId}`);
//   } catch (error) {
//     console.error(error);
//   }
// };
// 상세페이지 comment 가져오기
export const getPostComments = async _comments => {
  try {
    const comments = encodeURIComponent(JSON.stringify(_comments));
    return await axios.get(`/comments/${comments}`);
  } catch (error) {
    console.error(error);
  }
};

// 상세페이지 댓글 달기
export const postComment = async (postId, writerId, content) => {
  // UTC 계산 (PC와 관계 없이 한국 시간으로)
  const currentDate = new Date();
  const createdAt = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

  try {
    return await axios.post('/comment', { postId, writerId, createdAt, content });
  } catch (error) {
    console.error(error);
  }
};
// mypage 정보
export const getMyProfile = async () => {
  try {
    return await axios.get('/profile');
  } catch (error) {
    console.error(error);
  }
};

// profile 변경
export const changeUserProfile = async (curUserId, nickname, password, city, district) => {
  try {
    return await axios.patch(`/users/${curUserId}`, {
      nickname,
      password,
      city,
      district,
    });
  } catch (error) {
    console.error(error);
  }
};

// 회원탈퇴
export const deleteUserProfile = async (curUserId, password) => {
  try {
    return await axios.post(`/users/delete/${curUserId}`, {
      password,
    });
  } catch (error) {
    console.error(error);
  }
};

// 내글 불러오기
export const getMyPosts = async curUserId => {
  try {
    return await axios.get(`/mypost/${curUserId}`);
  } catch (error) {
    console.error(error);
  }
};

export const getIsUserLogin = async () => {
  try {
    return await axios.get('/user/login');
  } catch (error) {
    console.error(error);
  }
};

export const postUploadImages = async images => {
  try {
    return await axios.post('/upload', images);
  } catch (error) {
    console.error(error);
  }
};

export const addNewPost = async payload => {
  try {
    return await axios.post('/post', payload);
  } catch (error) {
    console.error(error);
  }
};

export const updatePost = async payload => {
  try {
    return await axios.put('/update', payload);
  } catch (error) {
    console.error(error);
  }
};
