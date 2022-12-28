const apiStatus = require('./ApiStatus')
const httpStatus = require('./HttpStatus')
const serverPolicy = require('./ServerPolicy')
const channelPolicy = require('./ChannelPolicy')
const messageResponse = require('./MessageResponse')

// status
const OK = "OK"
const ERR = "ERROR"
module.exports = {
    apiStatus,
    httpStatus,
    serverPolicy,
    channelPolicy,
    messageResponse,
    OK,
    ERR
}