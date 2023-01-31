const router = require('express').Router();
const { channelPolicy, serverPolicy } = require('../constant');
const ChannelController = require('../controllers/channel.controller');
const ChannelRoleController = require('../controllers/channelRole.controller');
const Authen = require('../middleware/authen');

router.get('/getAll/:serverId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.VIEW_CHANNEL), ChannelController.getAllByServer);
router.post('/', Authen.verifyToken, ChannelController.create);
router.put('/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_CHANNEL), ChannelController.update);
router.delete('/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_CHANNEL), ChannelController.delete );
router.get('/:channelId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.VIEW_CHANNEL), ChannelController.get);
// route role 
router.get('/roles/:channelId', Authen.verifyToken, ChannelRoleController.getAll);
router.post('/role/', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), ChannelRoleController.create);
router.get('/role/:roleId', Authen.verifyToken, ChannelRoleController.getById);
router.put('/role/:roleId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_ROLE), ChannelRoleController.update);
router.delete('/role/:roleId', Authen.verifyToken, Authen.verifyPermission(channelPolicy.MANAGE_ROLE), ChannelRoleController.delete);
module.exports = router;