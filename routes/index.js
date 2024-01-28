const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validationLogin, validationUserCreate } = require('../middlewares/validation');
const NotFoundError = require('../utils/errors/notFound');

router.post('/signup', validationUserCreate, login);
router.post('/signin', validationLogin, createUser);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use(auth, userRouter);
router.use(auth, movieRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

module.exports = router;
