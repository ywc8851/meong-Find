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
