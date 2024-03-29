const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const movieSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => isUrl(url),
        message: 'Некорректный адрес URL',
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (url) => isUrl(url),
        message: 'Некорректный адрес URL',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (url) => isUrl(url),
        message: 'Некорректный адрес URL',
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
