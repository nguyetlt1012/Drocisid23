const { OK, apiStatus, httpStatus, ERR } = require('../constant/index');
const CusError = require('../error/error');
const _resp = require('../response/response');
const MessageService = require('../service/message.service');
const { validate } = require('../utils/validator.util');
const MessageController = {
    getAllMessages: async(req, res, next) => {
        try {
            // default = 20
            // const page = (req.query.page && req.query.page > 0) ? req.query.page : 1
            // const limit = (req.query.limit && req.query.limit > 0) ? req.query.limit : 20
            // const keyword = req.query.keyword ? req.query.keyword : ''
            const {status, data} = await MessageService.getAllMessages(req.params.channelId)
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    sendMessage: async(req, res, next) => {
        try {
            
            const {status, data} = await MessageService.sendMessage(req.body.content, req.params.channelId, req.userId)
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    deleteMessage: async(req, res, next) => {
        try {
            const {status, data} = await MessageService.deleteMessage(req.params.messageId)
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS, `Success!`, data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    }
}

module.exports = MessageController