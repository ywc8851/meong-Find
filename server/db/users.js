const bcrypt = require('bcrypt');

const raw_users = [
  {
    id: 'ramndomda',
    email: 'ywc8851@naver.com',
    password: 'dyddn123',
    city: '서울특별시',
    district: '강남구',
    nickname: '쪼용웅',
    isValid: true,
  },
  {
    id: 'asdffffwee',
    email: 'tocic@naver.com',
    password: 'tldks123',
    city: '서울특별시',
    district: '광진구',
    nickname: '박샤니',
    isValid: true,
  },
  {
    id: 'dsalalalw',
    email: 'rurulalla@naver.com',
    password: '123456789',
    city: '서울특별시',
    district: '광진구',
    nickname: '안현서현서',
    isValid: true,
  },
  {
    id: 'dafqweqwr',
    email: 'a1212@naver.com',
    password: '123456789',
    city: '서울특별시',
    district: '광진구',
    nickname: '민s솦 ',
    isValid: false,
  },
];

const users = raw_users.map(user => ({ ...user, password: bcrypt.hashSync(user.password, 10) }));
module.exports = users;
