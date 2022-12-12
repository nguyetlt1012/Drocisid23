const router = require('express').Router()
const {verifyToken} = require('../middleware/authen.middleware')
const InviteController = require('../controllers/invite.controller')

router.post('/invite', verifyToken, InviteController.createInvite)

module.exports = router