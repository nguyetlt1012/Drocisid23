const router = require('express').Router()
const {verifyToken} = require('../middleware/authen')
const InviteController = require('../controllers/invite.controller')

router.post('/invite', verifyToken, InviteController.createInvite)
router.get('/invite/:code', verifyToken, InviteController.joinWithLink)

module.exports = router