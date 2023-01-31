const { OK, ERR } = require('../constant/index');

const ServerRoleGroupModel = require('../models/serverRoleGroup.model');
const UserServerRoleModel = require('../models/userServerRole.model');

const UserServerRoleService = {
    create: async (name, serverId, rolePolicies) => {
        const response = await ServerRoleGroupModel.create({
            name: name,
            rolePolicies: rolePolicies,
            serverId: serverId,
        });
        return {
            status: OK,
            data: response,
        };
    },
    getAllUsersBelongRoleGroup: async (serverId, serverRoleGroupId, page, perpage) => {
        try {
            const users = await UserServerRoleModel.find(
                {
                    serverId: serverId,
                    serverRoleGroupId: {
                        $in: [serverRoleGroupId]
                    }
                },
                {
                    userId: 1
                },
                {
                    skip: perpage * (page - 1),
                    limit: perpage,
                },
            );
            return {
                status: OK,
                data: users,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    // delete a role
    delete: async (serverId, serverRoleGroupId, userId) => {
        try {
            const user = await UserServerRoleModel.findOne({
                userId: userId,
                serverId: serverId
            });
            if (!user) throw new Error(`Cant find role group with roleId: ${serverRoleGroupId}`);
            if(!user.serverRoleGroupId.includes(serverRoleGroupId))
                throw new Error(`User: ${user} is not belong this role group: ${serverRoleGroupId}`)
            user.serverRoleGroupId.forEach(item => item != serverRoleGroupId)
            return {
                status: OK,
                data: user,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    get: async (serverId, userId) => {
        try {
            const user = await UserServerRoleModel.findOne({
                userId: userId,
                serverId: serverId
            });
            if (!user) throw new Error(`Cant find role group with roleId: ${serverId}`);
            return {
                status: OK,
                data: user,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    update: async (serverId, serverRoleGroupId, userId) => {
        try {
            const user = await UserServerRoleModel.findOne({
                userId: userId,
                serverId: serverId
            });
            if (!user) throw new Error(`Cant find role group with roleId: ${serverRoleGroupId}`);
            if(user.serverRoleGroupId.includes(serverRoleGroupId))
                throw new Error(`User: ${userId} already had this role group: ${serverRoleGroupId}`)
            user.serverRoleGroupId.push(serverRoleGroupId);
            return {
                status: OK,
                data: user,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    getUsersNotBelongRoleGroup: async (roleId, serverId) => {
        try {
            const users = await UserServerRoleModel.find({
                serverId: serverId,
                serverRoleGroupId: {
                    $nin: [roleId],
                },
            }, {
                userId: 1,
            });
            return {
                status: OK,
                data: users,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
};
module.exports = UserServerRoleService;
