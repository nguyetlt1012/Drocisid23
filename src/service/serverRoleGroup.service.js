const {OK, ERR} = require('../constant/index')

const ServerRoleGroupModel = require("../models/serverRoleGroup.model")
const UserServerRoleModel = require('../models/userServerRole.model')

const ServerRoleGroupService = {
    create: async (name, serverId, rolePolicies) => {
        const response = await ServerRoleGroupModel.create({
            name: name,
            rolePolicies: rolePolicies,
            serverId: serverId
        })
        return {
            status: OK,
            data: response
        }
    },
    getAll: async (serverId, page, perpage) => {
        try {
            const data = await ServerRoleGroupModel.find({
                serverId: serverId
            }, {
            }, {
                skip: perpage*(page-1),
                limit: perpage
            })
            return {
                status: OK,
                data: data
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    // delete a role
    delete: async(roleId) => {
        try {
            const role = await ServerRoleGroupModel.findByIdAndRemove(roleId)
            if(!role) throw new Error(`Cant find role group with roleId: ${roleId}`)
            // update all user has server role group which was remove
            await UserServerRoleModel.updateMany({
                serverId: role.serverId
            }, {
                $pull: {
                    serverRoleGroupId: roleId
                }
            })
            return {
                status: OK,
                data: role
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    get: async (roleId) => {
        try {
            const role = await ServerRoleGroupModel.findById(roleId);
            if(!role) throw new Error(`Cant find role group with roleId: ${roleId}`)
            return {
                status: OK,
                data: role,
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    update: async (roleId, name, rolePolicies) => {
        try {
            const role = await ServerRoleGroupModel.findByIdAndUpdate(roleId, {
                rolePolicies: rolePolicies,
                name: name
            }, {
                new: true
            });
            if(!role) throw new Error(`Cant find role group with roleId: ${roleId}`)
            return {
                status: OK,
                data: role,
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    }

}
module.exports = ServerRoleGroupService