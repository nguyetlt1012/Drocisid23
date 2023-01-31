const UserServerRoleService = require('../service/userServerRole.service');
const { OK, apiStatus, httpStatus, ERR } = require('../constant/index');
const CusError = require('../error/error');
const _resp = require('../response/response');

const UserServerRole = {
    addUserToRoleGroup: async (req, res, next) => {
        try {
            const { status, data } = await UserServerRoleService.update(
                req.params.serverId,
                req.params.roleId,
                req.body.userId,
            );
            if (status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data);
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    removeUserFromRoleGroup: async (req, res, next) => {
        try {
            const { status, data } = await UserServerRoleService.delete(
                req.params.serverId,
                req.params.roleId,
                req.params.userId,
            );
            if (status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data);
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getUsersNotBelongRoleGroup: async (req, res, next) => {
        try {
            const { status, data } = await UserServerRoleService.getUsersNotBelongRoleGroup(
                req.params.serverId,
                req.params.roleId
            );
            if (status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data);
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getDetailRolesUserOnServer: async (req, res, next) => {
        try {
            const { status, data } = await UserServerRoleService.get(
                req.params.serverId,
                req.params.userId,
            );
            if (status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data);
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    },
    getAllUsersBelongRoleGroup: async (req, res, next) => {
        try {
            const page = req.query.page > 0 ? req.query.page : 1
            const perpage = req.query.perpage > 0 ? req.query.perpage : 10
            const { status, data } = await UserServerRoleService.getAllUsersBelongRoleGroup(
                req.params.serverId,
                req.params.roleId,
                page,
                perpage,
            );
            if (status === ERR) throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.NOT_FOUND, data);
            _resp(res, httpStatus.CREATED, apiStatus.SUCCESS, 'Success', data);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message);
            } else _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message);
        }
    }
};


module.exports = UserServerRole