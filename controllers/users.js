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
        return next(new InaccurateError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.status(201).send({ message: 'Вы успешно зарегистрировались' }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     throw new InaccurateError('Переданы некорректные данные');
  //   }
  //   if (err.code === 11000) {
  //     throw new ConflictError('Пользователь с таким email уже существует');
  //   }
  //   next(err);
  // })
  // .catch(next);
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
