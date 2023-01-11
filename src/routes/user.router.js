const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller')
const Authen = require('../middleware/authen');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/invite/:code', Authen.verifyToken, userController.joinWithLink)
router.post('/request-join-server/:serverId', Authen.verifyToken, userController.requestJoinServer)
// router.get('/:userId', Authen.verifyToken, userController.getMe);
router.get('/', Authen.verifyToken, userController.getMe)
module.exports = router;
