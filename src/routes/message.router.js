const router = require('express').Router();
const { channelPolicy, serverPolicy } = require('../constant');
const ChannelController = require('../controllers/channel.controller');
const ChannelRoleController = require('../controllers/channelRole.controller');
const MessageController = require('../controllers/message.controller');
const Authen = require('../middleware/authen');

router.post('/:channelId', Authen.verifyToken,Authen.verifyPermission(channelPolicy.CREATE_MESSAGE), MessageController.sendMessage)

router.get('/:channelId', Authen.verifyToken, MessageController.getAllMessages)
// Authen.verifyPermission(channelPolicy.READ)

router.delete('/:channelId/:messageId', Authen.verifyToken, MessageController.deleteMessage)
module.exports = router;