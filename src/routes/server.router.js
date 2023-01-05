const router = require('express').Router();
const serverController = require('../controllers/server.controller');
const Authen = require('../middleware/authen');


// router.get('/', serverController.getAllServer);
router.post('/create', Authen.verifyToken,  serverController.createServer);

// admin api
router.get('/get-servers-joined-by-user/:userId', Authen.verifyToken, serverController.getAllServerJoinedByUser);
// router.post('/', Authen.verifyToken, serverController.get);
module.exports = router;
