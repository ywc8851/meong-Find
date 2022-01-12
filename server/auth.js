const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    jwt.verify(accessToken, process.env.SECRET_KEY);
    next();
  } catch (e) {
    return res.redirect('/signin');
  }
};

module.exports = auth;
