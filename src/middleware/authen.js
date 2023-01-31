require("dotenv").config();
const { apiStatus, httpStatus } = require('../constant');
const CusError = require('../error/error');
const _resp = require('../response/response');
const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const ServerModel = require("../models/server.model");
const UserServerRoleModel = require("../models/userServerRole.model");
const ServerRoleGroupModel = require("../models/serverRoleGroup.model");
const ChannelModel = require("../models/channel.model");
const ChannelRoleGroupModel = require("../models/channelRoleGroup.model");
const UserChanelRoleModel = require('../models/userChanelRole.model');

const Authen = {
    verifyToken: async (req, res, next) => {
        try {
            const bearerToken = req.headers.authorization;
            if (bearerToken === undefined || !bearerToken.startsWith('Bearer ')) throw new Error(`Invalid Token`);
            const token = (bearerToken && bearerToken.split(' ')[1]) || req?.cookies.jwt;
            if (!token) throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, `Invalid token`);
            
            const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            const currentUser = await UserModel.findOne({_id: decode.id})
            if (!currentUser)
                throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, 'Cant get customer from token');
            
            req.userId = currentUser.id;
            req.admin = true;
            next();
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    verifyPermission: (policy) => async (req, res, next) =>{
        try {
            const serverId = req.params.serverId || req.body.serverId ;
            if (serverId){
                const server = await ServerModel.findOne({_id: serverId});
                if (!server) throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, 'Server is invalid');

                if (server.ownerId == req.userId) return next();
                const role = await UserServerRoleModel.findOne({serverId: server.id, userId: req.userId});
                if (!role) throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, 'You are not a server member');

                const policyServer = await ServerRoleGroupModel.findOne({_id: role.serverRoleGroupId});
                if (policyServer.rolePolicies.includes(policy)) return next();
            }
            const channelId = req.body.channelId || req.params.channelId;
            if (channelId){
                const channel = await ChannelModel.findById(channelId);
                if (!channel) throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, 'Invalid channel');

                const userRole = await UserChanelRoleModel.findOne({channelId: channel.id, userId: req.userId});
                if (userRole){
                    const policyChannel = await ChannelRoleGroupModel.findOne({_id: userRole.channelRoleGroupId});
                    if (policyChannel?.rolePolicies.includes(policy)) return next();
                }
                const policyChannel = await ChannelRoleGroupModel.findOne({channelId: channel.id, name: '@everyone'});
                console.log(policyChannel)
                if (policyChannel?.rolePolicies.includes(policy)) return next();
            }
            // _resp(res, httpStatus.UNAUTHORIZED, apiStatus.AUTH_ERROR, 'Invalid permission', {});
            next()
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    }
};


module.exports = Authen;
