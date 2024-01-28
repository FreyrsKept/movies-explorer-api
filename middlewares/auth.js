const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/authError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = autorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;

  next();
};
