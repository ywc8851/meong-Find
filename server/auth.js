const jwt = require('jsonwebtoken');
const { users } = require('./db');

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    const { email } = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (!email) {
      return res.redirect('back');
    }
    if (req.url === '/user/login') {
      const [{ nickname }] = users.filter({ email });
      return res.send({ nickname });
    }
    next();
  } catch (e) {
    if (req.url === '/user/login') {
      return res.send();
    }
    return res.redirect('back');
  }
};

const blockLoginUser = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  if (!accessToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (decoded) {
      return res.redirect('back');
    }
    next();
  } catch (error) {
    res.redirect('/signin');
  }
};

module.exports = { auth, blockLoginUser };
