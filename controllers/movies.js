const Movie = require('../models/movie');
const NotFoundError = require('../utils/errors/notFound');
const ForbiddenError = require('../utils/errors/forbidden');
const InaccurateError = require('../utils/errors/inaccurate');

function getMovies(req, res, next) {
  const { _id } = req.user;
  Movie.find({ owner: _id }).populate('owner', '_id')
    .then((movies) => {
      if (movies) return res.send(movies);

      throw new NotFoundError('По вашему запросу фильмы не найдены.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

function createMovie(req, res, next) {
  const {
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const { _id } = req.user;
  Movie.create({
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailerLink, thumbnail, owner: _id, movieId, nameRU, nameEN,
  })
    .then((movie) => {
      const { _id: movieApiId } = movie;
      res.status(201).send({ message: movieApiId });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError('По вашему запросу фильмы не найдены.'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('По вашему запросу фильмы не найдены.');
      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) {
        throw new ForbiddenError('В доступе отказано');
      }
      movie
        .deleteOne()
        .then(() => res.send({ message: null }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
