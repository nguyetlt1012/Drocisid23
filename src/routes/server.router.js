const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const serverController = require('../controllers/server.controller');

router.use(authController.protect);

// router.get('/', serverController.getAllServer);
router.post('/create', serverController.create);
router.post('/', serverController.get);
module.exports = router;
