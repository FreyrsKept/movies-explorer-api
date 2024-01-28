const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationUserGet, validationUserUpdate } = require('../middlewares/validation');

router.get('/me', validationUserGet, getUser);
router.patch('/me', validationUserUpdate, updateUser);

module.exports = router;
