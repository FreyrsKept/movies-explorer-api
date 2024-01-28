const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

const { Schema } = mongoose;
const AuthError = require('../utils/errors/authError');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Требуется ввести электронный адрес',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return (
          this
            .findOne({ email })
            .select('+password')
        )
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password)
                .then((matched) => {
                  if (matched) return user;
                  return Promise.reject();
                });
            }
            throw new AuthError('Неправильная почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
