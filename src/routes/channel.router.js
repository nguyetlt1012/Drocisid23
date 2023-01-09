const router = require('express').Router();
const { channelPolicy, serverPolicy } = require('../constant');
const ChannelController = require('../controllers/channel.controller');
const ChannelRoleController = require('../controllers/channelRole.controller');
const Authen = require('../middleware/authen');

router.get('/getAll/:serverId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.VIEW_CHANNEL), ChannelController.getAllByServer);
router.post('/create', Authen.verifyToken, ChannelController.create);
router.put('/update/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_CHANNEL), ChannelController.update);
router.delete('/delete/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_CHANNEL), ChannelController.delete );
router.get('/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.VIEW_CHANNEL), ChannelController.getById);
// route role 
router.post('/role/create', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), ChannelRoleController.create);
router.get('/role/:roleId', Authen.verifyToken, ChannelRoleController.getById);
router.put('/role/update/:roleId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_ROLE), ChannelRoleController.update);
router.delete('/role/delete/:roleId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_ROLE), ChannelRoleController.delete);
module.exports = router;