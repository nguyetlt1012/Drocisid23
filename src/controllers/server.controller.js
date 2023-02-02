const { OK, apiStatus, httpStatus, ERR } = require('../constant/index');
const CusError = require('../error/error');
const _resp = require('../response/response');
const { validate } = require('../utils/validator.util');
const InviteService = require('../service/invite.service.js');
const ServerService = require('../service/server.service');

const ServerController = {
    createServer: async (req, res, next) => {
        try {
            // when user create server => update field severIds, 
            // create general channel
            // Check Params is required
            const checkParams = await validate.checkParamRequest(req, ['name', 'description']);
            if (checkParams.status === ERR) {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, checkParams.message);
            }
            const response = await ServerService.create(req.userId, req.body.name, req.body.description, req.body.isPublic);
            if (response.status !== OK) {
                throw new CusError(apiStatus.OTHER_ERROR, httpStatus.INTERNAL_SERVER_ERROR, response.data);
            }
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Server created!', response.data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getAllServersJoinedByUser: async (req, res, next) => {
        try {
            const {status, data} = await ServerService.getAllServerJoinedByUser(req.userId);
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    updateServer: async (req, res, next) => {
        try {
            const response = await ServerService.update(req.params.serverId, req.body.description, req.body.isPublic);
            if (response.status !== OK) {
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, response.data);
            }
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, 'Server update!', response.data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    deleteServer: async (req, res, next) => {
        try {
            const { status, data } = await ServerService.delete(req.params.serverId, req.userId);
            if (status !== OK) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.FORBIDDEN, data);
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Delete success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getServerById: async (req, res, next) => {
        try {
            const {status, data} = await ServerService.getByID(req.params.serverId, req.userId)
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getServersPublic: async (req, res, next) => {
        try {
            // default = 20
            const page = (req.query.page && req.query.page > 0) ? req.query.page : 1
            const limit = (req.query.limit && req.query.limit > 0) ? req.query.limit : 10
            const keyword = req.query.keyword ? req.query.keyword : ''
            const {status, data} = await ServerService.getServersPulic(page, limit,keyword)
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    // accept or deny a user request join
    responseUserRequestJoin: async (req, res, next) => {
        try {
            const {userIdRequest, acceptJoin} = req.body
            let response
            if(acceptJoin)
                response =  await ServerService.joinServer(userIdRequest, req.params.serverId)
            else 
                response = await ServerService.denyUserRequestJoin(userIdRequest, req.params.serverId)
            if(response.status === ERR) throw new CusError(apiStatus.INVALID_PARAM, httpStatus.NOT_FOUND, response.data)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Success!`, response.data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    createInviteServer: async (req, res, next) => {
        try {
            const checkParams = await validate.checkParamRequest(req, ['expireTime']);

            if(checkParams.status === ERR) {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, checkParams.message)
            }
            const {status, data} = await InviteService.createInvite(req.userId, req.body.expireTime, req.params.serverId, 0)
            // inviteLink: /invite/code
            if(status === ERR){
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.INTERNAL_SERVER_ERROR, data);
            }
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, "SUCCESS", data)

        } catch (error) {
            if(error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message)
            }
            else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message)
            }
        }
    },
    kickUser: async (req, res, next) => {
        try {
            const userIdKick = req.body.userIdKick
            const {status, data} = await ServerService.kickUser(userIdKick, req.params.serverId)
            if(status === ERR){
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.INTERNAL_SERVER_ERROR, data);
            }
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, "SUCCESS", data)
        } catch (error) {
            if(error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message)
            }
            else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message)
            }
        }
    }
};

module.exports = ServerController;
