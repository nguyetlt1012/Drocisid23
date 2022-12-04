const router = require('express').Router()
const InviteController = require('../controllers/')

router.post('/invite', InviteController.create)

module.exports = router