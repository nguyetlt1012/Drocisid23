const { ERR, apiStatus, httpStatus } = require('../constant');
const CusError = require('../error/error');
const _resp = require('../response/response');
const InviteService = require('../service/');
const { validate } = require('../utils/validator.util');

const InviteController = {
    createInvite: async (req, res, next) => {
        try {
            const checkParams = await validate.checkParamRequest(req, ['expireTime', 'source', 'inviteType']);

            if(checkParams.status === ERR) {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, checkParams.message)
            }
            //call service
            const response = await InviteService.createInvite({
                createBy: req.userId,
                expireTime: req.body.expireTime,
                source: req.body.source,
                inviteType: req.body.source,
            })
            // inviteLink: /invite/code
            if(response.status === ERR){
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.INTERNAL_SERVER_ERROR, response.message);
            }
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, "SUCCESS", response.data)

        } catch (error) {
            if(error instanceof CusError) {
                _resp(res, error.apiStatus, error.httpStatus, error.message)
            }
            else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message)
            }
        }
    },
    joinWithLink: async (req, res, next) => {
        try {
            
        } catch (error) {
            
        }
    }
}

module.export = InviteController