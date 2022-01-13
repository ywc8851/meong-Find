const jwt = require('jsonwebtoken');
const { users } = require('./db');

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    const { email } = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (req.url === '/user/login') {
      const [{ nickname }] = users.filter({ email });
      return res.send({ nickname });
    }
    next();
  } catch (e) {
    if (req.url === '/user/login') {
      return res.send();
    }
    return res.redirect('/signin');
  }
};

const blockLoginUser = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  if (!accessToken) {
    next();
  }

  try {
    jwt.verify(accessToken, process.env.SECRET_KEY, (error, decoded) => {
      if (decoded) {
        return res.sendStatus(302);
      } else next();
    });
  } catch (error) {
    res.redirect('/signin');
  }
};

module.exports = { auth, blockLoginUser };
