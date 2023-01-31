const ServerRoleGroupService = require("../service/serverRoleGroup.service")
const { OK, apiStatus, httpStatus, ERR } = require('../constant/index');
const CusError = require('../error/error');
const _resp = require('../response/response');
module.exports = {
    createRoleGroup: async (req, res, next) => {
        try {
            const {status, data} = await ServerRoleGroupService.create(req.body.name, req.params.serverId, req.body.rolePolicies);
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    updateRoleGroup: async (req, res, next) => {
        try {
            const {status, data} = await ServerRoleGroupService.update(req.params.roleId, req.body.name, req.body.rolePolicies);
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    deleteRoleGroup: async (req, res, next) => {
        try {
            const {status, data} = await ServerRoleGroupService.delete(req.params.roleId);
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getRoleGroup: async (req, res, next) => {
        try {
            const {status, data} = await ServerRoleGroupService.get(req.params.roleId);
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getAllRoleGroup: async (req, res, next) => {
        try {
            const perpage = req.query.perpage > 0 ? req.query.perpage : 10
            const page = req.query.page > 0 ? req.query.page : 1
            const {status, data} = await ServerRoleGroupService.getAll(req.params.serverId, page, perpage);
            if(status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data)
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    }
}