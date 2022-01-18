const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    const { email } = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (!email) {
      return res.redirect('back');
    }
    if (req.url === '/user/login') {
      req.email = email;
    }
    next();
  } catch (e) {
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
    res.redirect('back');
  }
};

module.exports = { auth, blockLoginUser };
