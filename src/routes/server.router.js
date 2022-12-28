const router = require('express').Router();
const serverController = require('../controllers/server.controller');
const Authen = require('../middleware/authen');


// router.get('/', serverController.getAllServer);
router.post('/create', Authen.verifyToken,  serverController.createServer);
// router.post('/', Authen.verifyToken, serverController.get);
module.exports = router;
