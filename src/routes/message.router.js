const router = require('express').Router();
const { channelPolicy, serverPolicy } = require('../constant');
const ChannelController = require('../controllers/channel.controller');
const ChannelRoleController = require('../controllers/channelRole.controller');
const MessageController = require('../controllers/message.controller');
const Authen = require('../middleware/authen');

router.post('/:channelId', Authen.verifyToken, MessageController.sendMessage)
// Authen.verifyPermission(channelPolicy.CREATE_MESSAGE)
router.get('/:channelId', Authen.verifyToken, MessageController.getAllMessages)
// Authen.verifyPermission(channelPolicy.READ)
module.exports = router;