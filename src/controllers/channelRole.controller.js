const ChannelRoleGroupService = require('../service/channelRole.service')
const { validate } = require("../utils/validator.util");
const _resp = require("../response/response");
const { httpStatus, apiStatus, ERR } = require("../constant");
const CusError = require("../error/error");

const ChannelRoleController = {
    create: async(req, res, next) =>{
        try {
            const valid = await validate.checkParamRequest(req, ['name']);
            if (valid.status == ERR) {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, valid.message);
            }

            const role = await ChannelRoleGroupService.create(req.body);
            if (role.status == ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.BAD_REQUEST, role.message);
            
            _resp(res, httpStatus.OK, apiStatus.SUCCESS,"create success", role.data);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    getById: async(req, res, next) =>{
        try {
            const roleId = req.params.roleId;
            if (!roleId) throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, "invalid role");

            const role = await ChannelRoleGroupService.getById(roleId);
            if (role.status == ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.BAD_REQUEST, role.message);

            _resp(res, httpStatus.OK, apiStatus.SUCCESS,"create success", role.data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    update: async(req, res, next) =>{
        try {
            const roleId = req.params.roleId;
            if (!roleId) throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, "invalid role");
            const rolePolicies = req.body.rolePolicies;
            rolePolicies.map((p)=>{
                if (!Number.isInteger(p) || p < 0 || p > 7) throw new CusError(apiStatus.OTHER_ERROR, httpStatus.BAD_REQUEST, "invalid policy");
            });
            
            const role = await ChannelRoleGroupService.update(roleId, {rolePolicies: rolePolicies});
            if (role.status == ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.BAD_REQUEST, role.message);
            console.log(role)
            _resp(res, httpStatus.OK, apiStatus.SUCCESS,"create success", role.data);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            } 
        }
    },
    delete: async(req, res, next) =>{
        try {
            const roleId = req.params.roleId;
            if (!roleId) throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, "invalid role");
            const response = await ChannelRoleGroupService.delete(roleId);

            _resp(res, httpStatus.OK, apiStatus.SUCCESS, "delete success", response.data);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            } 
        }
    }
};
module.exports = ChannelRoleController;