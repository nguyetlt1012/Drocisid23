const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

// router.use(authController.protect);

module.exports = router;
