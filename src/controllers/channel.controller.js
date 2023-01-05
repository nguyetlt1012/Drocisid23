const { validate } = require("../utils/validator.util");
const channelService = require('../service/channel.service');
const _resp = require("../response/response");
const { httpStatus, apiStatus, ERR } = require("../constant");
const CusError = require("../error/error");

const ChannelController= {
    create: async (req, res, next) =>{
        try {
            const valid = await validate.checkParamRequest(req, ['name', 'type']);
            if (valid.status == ERR) {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, valid.message);
            }

            const channel = await channelService.create(req.body);
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, channel);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    getAllByServer: async (req, res, next) =>{
        try {
            const channels = await channelService.getAllByServer(req.params.serverId);
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, channels);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    update: async (req, res, next) =>{
        try {
            const channelId = req.params.channelId;
            const response = await channelService.update(channelId, req.body);
            if (response.status == ERR){
                throw new CusError(apiStatus.OTHER_ERROR, httpStatus.INTERNAL_SERVER_ERROR, response.message)
            }
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, response.data);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    delete: async (req, res, next) =>{
        try {
            const channelId = req.params.channelId;
            const response = await channelService.delete(channelId);
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, response.data);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    }

}
module.exports = ChannelController;