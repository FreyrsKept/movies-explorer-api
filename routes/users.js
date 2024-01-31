const router = require('express').Router();
const { getUser, updateUser, signout } = require('../controllers/users');
const { validationUserGet, validationUserUpdate } = require('../middlewares/validation');

router.get('/me', validationUserGet, getUser);
router.patch('/me', validationUserUpdate, updateUser);
router.post('/signout', signout);

module.exports = router;
