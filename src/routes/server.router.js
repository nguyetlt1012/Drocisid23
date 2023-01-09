const router = require('express').Router();
const { OWNER, MANAGE_INVITE, MANAGE_SERVER } = require('../constant/ServerPolicy');
const serverController = require('../controllers/server.controller');
const Authen = require('../middleware/authen');




router.get('/get-servers-join-user', Authen.verifyToken, serverController.getAllServersJoinedByUser)


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

router.put('/:id/kick-user', Authen.verifyToken, serverController.kickUser)
// create invite link
router.post('/create-invite/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_INVITE), serverController.createInviteServer)


// response request join
router.post('/response-requests/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_SERVER), serverController.responseUserRequestJoin)





module.exports = router;
