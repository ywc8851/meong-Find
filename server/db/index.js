const users = require('./users');
const posts = require('./posts');
const comments = require('./comments');

const handleData = data => {
  let datas = data;
  return {
    get() {
      return datas;
    },
    create(newData) {
      datas = [newData, ...datas];
      return newData;
    },
    createBack(newData) {
      datas = [...datas, newData];
      return newData;
    },
    delete(id) {
      datas = datas.filter(data => data.id !== id);
    },
    filter(payload) {
      let filtered = datas;
      Object.keys(payload).forEach(key => {
        filtered = filtered.filter(data => data[key] === payload[key]);
      });
      return filtered;
    },
    update(id, payload) {
      datas = datas.map(data => (data.id === id ? { ...data, ...payload } : data));
      return datas.find(data => data.id === id);
    },
  };
};

module.exports = {
  users: handleData(users),
  posts: handleData(posts),
  comments: handleData(comments),
};
