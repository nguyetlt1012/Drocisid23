const ServerController = require('../controllers/server.controller')
const router = require('express').Router();


router.post('server', validateInput, ServerController.createServer)



module.exports = router