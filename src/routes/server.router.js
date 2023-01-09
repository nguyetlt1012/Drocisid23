const router = require('express').Router();
const { OWNER, MANAGE_INVITE, MANAGE_SERVER } = require('../constant/ServerPolicy');
const serverController = require('../controllers/server.controller');
const Authen = require('../middleware/authen');


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

// create invite link
router.post('/create-invite/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_INVITE), serverController.createInviteServer)

// get all request join
router.get('/:serverId/get-requests', Authen.verifyToken, Authen.verifyPermission(MANAGE_SERVER), serverController.getAllRequestsJoin)

// get detail request join
router.get('get-requests/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_SERVER), serverController.getRequestJoin)

// response request join
router.post('response-requests/:id', Authen.verifyToken, Authen.verifyPermission(MANAGE_SERVER), serverController.responseUserRequestJoin)




// admin api
// router.get('/get-servers-joined-by-user/:userId', Authen.verifyToken, serverController.getAllServerJoinedByUser);



module.exports = router;
