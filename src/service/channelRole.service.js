const { ERR, OK } = require("../constant");
const ChannelModel = require("../models/channel.model");
const ChannelRoleGroupModel = require("../models/channelRoleGroup.model");
const ServerRoleGroupModel = require("../models/serverRoleGroup.model");
const UserChannelRoleModel = require("../models/userChanelRole.model");

const ChannelRoleGroupService = {
    create: async(data) =>{
        try {
            const roleServer = await ServerRoleGroupModel.findOne({name: data.name, serverId: data.serverId});
            if (!roleServer) throw new Error("Invalid role");

            const roleChannel = await ChannelRoleGroupModel.findOne({name: data.name, channelId: data.channelId});
            if (roleChannel) throw new Error("Duplicate role in this channel");
            const channelRoleGroup = await ChannelRoleGroupModel.create({
                name: data.name,
                channelId: data.channelId,
                rolePolicies: roleServer.rolePolicies,
                memberIds: roleServer.memberIds
            });
            if (!channelRoleGroup) throw new Error("Can't create channel role");
            return {
                status: OK,
                data: channelRoleGroup
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    getById: async(id) =>{
        try {
            const role = await ChannelRoleGroupModel.findById(id);
            if (!role) throw new Error("invalid role");
            return {
                status: OK,
                data: role
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    update: async(roleId, data) =>{
        try {
            const role = await ChannelRoleGroupModel.findByIdAndUpdate(roleId, data, {
                new: true
            });
            if (!role) throw new Error("Invalid role");
            
            return {
                status: OK,
                data: role
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    delete: async(roleId) =>{
        try {
            await ChannelRoleGroupModel.findByIdAndRemove(roleId);
            return {
                status: OK,
                data: {}
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    getAll: async(channelId, userId) =>{
        try {
            const roleEveryOne = await ChannelRoleGroupModel.findOne({channelId: channelId, name: '@everyone'});
            const userRoles = await UserChannelRoleModel.find({channelId: channelId, userId: userId}).populate('channelId');
            console.log(channelId, userId)
            if (!userRoles.length) return {
                status: OK,
                data: roleEveryOne
            }
            return {
                status: OK,
                data: [roleEveryOne, userRoles]
            }
            
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    }
}

module.exports = ChannelRoleGroupService; 