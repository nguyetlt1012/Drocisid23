// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const User = require('../models/user.model');
// const Server = require('../models/server.model');
// const Channel = require('../models/channel.model');
// const ServerRoleGroup = require('../models/serverRoleGroup.model');
// const serverPolicy = require('../constant/serverPolicy');
// const UserServerRole = require('../models/userServerRole.model');

const { OK, apiStatus, httpStatus, ERR } = require("../constant/index");
const CusError = require("../error/error");
const _resp = require("../response/response");
const { validate } = require("../utils/validator.util");
const ServerService = require("../service/server.service");

const ServerController = {
  createServer: async (req, res, next) => {
    try {

      // Check Params is required
      const checkParams = await validate.checkParamRequest(req, ['name', 'description'])
      if(checkParams.status === ERR) {
        throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, checkParams.message)
      }
      const dataReq = {
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.isPublic,
      };
      dataReq.ownerId = req.userId
      const response = await ServerService.create(dataReq)
      console.log(response)
      if(response.status !== OK) {
        throw new CusError(apiStatus.OTHER_ERROR, httpStatus.INTERNAL_SERVER_ERROR, response.message)
      }
      _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, "Server created!", response.data)
    } catch (error) {
      if(error instanceof CusError) {
        _resp(res, error.httpStatus, error.apiStatus, error.message)
      }
      else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message)
    }
  },
  modifyServer: async (req, res, next) => {
    try {
      
    } catch (error) {
      
    }
  }
}

module.exports = ServerController