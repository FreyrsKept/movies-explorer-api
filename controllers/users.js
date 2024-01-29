const { JWT_SECRET, NODE_ENV } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const InaccurateError = require('../utils/errors/inaccurate');
const NotFoundError = require('../utils/errors/notFound');
const ConflictError = require('../utils/errors/conflict');

function getUser(req, res, next) {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new InaccurateError('Переданы некорректные данные');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      next(err);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  console.log(email);
  console.log(password);
  console.log(name);
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, passoword: hash, name,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InaccurateError('Переданы некорректные данные');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      next(err);
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
}

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
