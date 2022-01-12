const users = require('./users');
const posts = require('./posts');
const comments = require('./comments');

const handleData = data => {
  let datas = data;
  return {
    get() {
      return datas;
    },
    set(payload) {
      datas = payload;
    },
    create(newData) {
      datas = [newData, ...datas];
      return newData;
    },
    delete(id) {
      datas = datas.filter(data => data.id !== id);
    },
    findById(id) {
      return datas.find(data => data.id === id);
    },
    filter(payload) {
      let filtered = datas;
      Object.keys(payload).forEach(key => {
        filtered = filtered.filter(data => data[key] === payload[key]);
      });
      return filtered;
    },
  };
};

module.exports = {
  users: handleData(users),
  posts: handleData(posts),
  comments: handleData(comments),
};
