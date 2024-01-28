const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationMovieCreate, validationMovieDelete } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validationMovieCreate, createMovie);
router.delete('/:movieId', validationMovieDelete, deleteMovie);

module.exports = router;
