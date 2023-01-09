const router = require('express').Router()
const {verifyToken} = require('../middleware/authen')
const InviteController = require('../controllers/invite.controller')
const Authen = require('../middleware/authen')

// router.post('/:id', verifyToken, InviteController.createInvite)
router.get('/:code', Authen.verifyToken, InviteController.joinWithLink)

module.exports = router