const router = require('express').Router();
const { channelPolicy, serverPolicy } = require('../constant');
const ChannelController = require('../controllers/channel.controller');
const Authen = require('../middleware/authen');

router.get('/getAll/:serverId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.VIEW_CHANNEL), ChannelController.getAllByServer);
router.post('/create', Authen.verifyToken, ChannelController.create);
router.put('/update/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_CHANNEL), ChannelController.update);
router.delete('/delete/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_CHANNEL), ChannelController.delete );
module.exports = router;