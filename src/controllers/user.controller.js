const { ERR, apiStatus, httpStatus } = require('../constant');
const CusError = require('../error/error');
const _resp = require('../response/response');
const ChannelService = require('../service/channel.service');
const InviteService = require('../service/invite.service');
const ServerService = require('../service/server.service');

const UserController = {
    joinWithLink: async (req, res, next) => {
        try {
            const code = req.params.code;
            // find the code, if found, add to member of code
            const invite = await InviteService.getInviteByCode(code);
            if(invite.status == ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, invite.data)
            let response;
            console.log(invite)
            if(invite.data && invite.data.inviteType === 0) {
                response = await ServerService.joinServer(req.userId, invite.data.source);
            }
            else {
                // response = await ChannelService.joinChannel
            }
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Joined server!', response.data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    // user can make a request to join a public server
    requestJoinServer: async (req, res, next) => {
        
    }
}

module.exports = UserController