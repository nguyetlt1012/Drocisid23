const router = require('express').Router();
const ChannelController = require('../controllers/channel.controller');
const Authen = require('../middleware/authen.middleware');

router.post('/getAll', Authen.verifyToken, ChannelController.getByServer());

module.exports = router;