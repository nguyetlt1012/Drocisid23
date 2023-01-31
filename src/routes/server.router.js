const router = require('express').Router();
const serverPolicy = require('../constant/ServerPolicy');
const { OWNER, MANAGE_INVITE, MANAGE_SERVER } = require('../constant/ServerPolicy');
const serverController = require('../controllers/server.controller');
const Authen = require('../middleware/authen');
const serverRoleGroup = require('../controllers/serverRoleGroup.controller');
const serverRoleGroupController = require('../controllers/serverRoleGroup.controller');
const UserServerRole = require('../controllers/userServerRole.controller');

// get All Servers Joined By User
router.get('/get-servers-join-user', Authen.verifyToken, serverController.getAllServersJoinedByUser)

// response User Request Join
router.post('/response-user-request/:serverId', Authen.verifyToken, serverController.responseUserRequestJoin)


// get-server-public
router.get('/get-servers-public', serverController.getServersPublic)

// get-member
router.get('/:id', Authen.verifyToken, serverController.getServerById);

// router.get('/', serverController.getAllServer);
router.delete('/:id', Authen.verifyToken, Authen.verifyPermission(OWNER), serverController.deleteServer)

// create
router.post('/', Authen.verifyToken,  serverController.createServer);

// update
router.put('/:id', Authen.verifyToken, serverController.updateServer);


// kick user to server
router.put('/:id/kick-user', Authen.verifyToken, serverController.kickUser)
// create invite link
router.post('/create-invite/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_INVITE), serverController.createInviteServer)


// response request join
router.post('/response-requests/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_SERVER), serverController.responseUserRequestJoin)


// Role on server
router.post('/:serverId/roles',Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), serverRoleGroup.createRoleGroup)

// get all roles of current server
router.get('/:serverId/roles',Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), serverRoleGroup.getAllRoleGroup)

// delete role
router.delete('/:serverId/roles/:roleId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), serverRoleGroupController.deleteRoleGroup)

router.get('/:serverId/roles/:roleId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), serverRoleGroup.getRoleGroup)

router.put('/:serverId/roles/:roleId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), serverRoleGroup.updateRoleGroup)



// user-role-server
router.put('/:serverId/user-role/:roleId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), UserServerRole.addUserToRoleGroup)
router.get('/:serverId/user-role/:userId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), UserServerRole.getDetailRolesUserOnServer)
router.get('/:serverId/user-role/get-all-members/:roleId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), UserServerRole.getAllUsersBelongRoleGroup)
router.get('/:serverId/user-role/users-not-belong/:roleId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), UserServerRole.getUsersNotBelongRoleGroup)
router.delete('/:serverId/user-role/:roleId/:userId', Authen.verifyToken, Authen.verifyPermission(serverPolicy.MANAGE_ROLE), UserServerRole.removeUserFromRoleGroup)

module.exports = router;
