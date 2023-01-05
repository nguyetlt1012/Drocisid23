const { OK, apiStatus, httpStatus, ERR } = require('../constant/index');
const CusError = require('../error/error');
const _resp = require('../response/response');
const { validate } = require('../utils/validator.util');
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
            const dataReq = {
                name: req.body.name,
                description: req.body.description,
                isPublic: req.body.isPublic,
            };
            dataReq.ownerId = req.userId;
            const response = await ServerService.create(dataReq);
            console.log(response);
            if (response.status !== OK) {
                throw new CusError(apiStatus.OTHER_ERROR, httpStatus.INTERNAL_SERVER_ERROR, response.message);
            }
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Server created!', response.data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    // using admin call
    getAllServerJoinedByUser: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const response = await ServerService.getAllServerJoinedByUser(userId);
        } catch (error) {}
    },
    modifyServer: async (req, res, next) => {
        try {
            const { name, description, isPublic } = req.body;
            const response = await ServerService.modify(req.params.id, { name, description, isPublic });
            if (response.status !== OK) {
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, response.message);
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
            const { status, data } = await ServerService.delete(req.params.id, req.userId);
            if (status !== OK) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.FORBIDDEN, data);
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Delete success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
};

module.exports = ServerController;
