const isSingleDigit = (date, limit) => (date < limit ? '0' : '');

const date = new Date();
const createdAt = `${date.getFullYear()}-${isSingleDigit(date.getMonth(), 9)}${
  date.getMonth() + 1
}-${isSingleDigit(date.getDate(), 10)}${date.getDate()}`;

module.exports = { createdAt };
