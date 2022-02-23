# meong-Find

## 프로젝트 소개

반려동물 1500만 시대, 반려견에 대한 실종 제보와 도움을 청할 곳은 없는 상황

이러한 실종된 반려동물을 보고 신고하거나 도움이 필요한 주인들에게 소식을 알려 강아지가 주인의 품으로 돌아갈 수 있도록 만든 서비스입니다.

## 기술 스택

<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<img src="https://img.shields.io/badge/css3-F43059?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=black"> <img src="https://img.shields.io/badge/babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=black">

## use-case

![image](https://user-images.githubusercontent.com/52738906/148763699-f840f47a-99a0-4771-845c-3467a9cc0da5.png)

## 지원기능

1. 로그인
2. 회원가입
3. 글 등록
4. 글 수정/삭제
5. 댓글 등록
6. 댓글 수정/삭제
7. 검색
8. 채팅

## 스토리보드

- 메인 페이지

![image](https://user-images.githubusercontent.com/53730691/148711206-e4126cc8-b222-4a55-b1b1-6725f6cde0c9.png)

- 글 상세 페이지

![image](https://user-images.githubusercontent.com/53730691/148711265-21816478-57a6-4309-97c1-93216f3636ed.png)

- 글 등록

![image](https://user-images.githubusercontent.com/53730691/148711177-49fb4c35-2746-4dd9-b187-06c9d2f429c3.png)

- 마이페이지

![](https://images.velog.io/images/mingsomm/post/51476dbe-dfd7-4b43-95b9-811b87593707/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-01-10%2014.15.32.png)

- 회원가입

![](https://images.velog.io/images/mingsomm/post/41012fb5-ed20-430a-8b3f-099d75e8c2c4/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-01-10%2014.11.53.png)

- 로그인

![image](https://user-images.githubusercontent.com/53730691/148711370-1db5ed23-e14a-4918-9fc9-a46569e78890.png)

## mock data

```js
export const users = [
  {
    id: 'asdfasdf',
    email: 'mingmang@google.com',
    password: '12345678',
    city: 'seoul',
    district: 'gangnam-gu',
    nickname: 'mingmangdi',
  },
];

export const posts = [
  {
    id: 'asdfdsa',
    userId: 'asdfasdf',
    createdAt: '2021-01-10',
    images: ['url', 'url'],
    title: '밍망디 개 찾아요',
    animal: 'dog',
    type: 'siba',
    content: '집나간 강아지를 찾습니다',
    city: 'gyeonggi-do',
    district: 'namyangjoo',
    comments: ['afsd', 'sadf'],
  },
];

export const comments = [
  {
    id: 'asdfasfd',
    postId: 'dasfas',
    userId: 'fsdfsd',
    createdAt: '2021-01-10',
    content: 'hi',
  },
];
```
