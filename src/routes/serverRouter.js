const router = require('express').Router();
const authController = require('../controllers/authController');
const serverController = require('../controllers/serverController');

router.use(authController.protect);

// router.get('/', serverController.getAllServer);
router.post('/create', serverController.create);

module.exports = router;
