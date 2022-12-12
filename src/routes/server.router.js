const router = require('express').Router();
const serverController = require('../controllers/server.controller');
const Authen = require('../middleware/authen.middleware');


// router.get('/', serverController.getAllServer);
router.post('/create', Authen.verifyToken,  serverController.create);
router.post('/', Authen.verifyToken, serverController.get);
module.exports = router;
