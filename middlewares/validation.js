const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const InaccurateError = require('../utils/errors/inaccurate');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new InaccurateError('Некорректный адрес URL');
};

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validationUserGet = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

// const validationUserSignout = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().alphanum().length(24).hex(),
//   }),
// });

const validationUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validationMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationUrl),
    trailerLink: Joi.string().required().custom(validationUrl),
    thumbnail: Joi.string().required().custom(validationUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationMovieDelete = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationLogin,
  validationUserCreate,
  validationUserGet,
  // validationUserSignout,
  validationUserUpdate,
  validationMovieCreate,
  validationMovieDelete,
};
