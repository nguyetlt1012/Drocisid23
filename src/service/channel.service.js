const Channel = require('../models/channel.model');
const Server = require('../models/server.model');
const UserServerRole = require('../models/userServerRole.model');
const ServerRoleGroup = require('../models/serverRoleGroup.model');
const { serverPolicy, ERR, OK, channelPolicy } = require('../constant/index');
const ChannelRoleGroup = require('../models/channelRoleGroup.model');
const MessageModel = require('../models/message.model');
const ChannelRoleGroupService = require('../service/channelRole.service')
const ChannelService = {
    create: async (channel) => {
        try {
            const server = await Server.findOne({ _id: channel.serverId });
            if (!server) {
                throw new Error('Invalid server');
            }
            // const role = await UserServerRole.findOne({ serverId: channel.serverId, userId: channel.userId });
            // if (!role) {
            //     throw new Error('Invalid server role');
            // }

            // const policy = await ServerRoleGroup.findOne({ _id: role.serverRoleGroupId });
            // if (!policy) {
            //     throw new Error('Invalid server role group');
            // }
            // if (!policy.rolePolicies.includes(serverPolicy.MANAGE_CHANNEL)) {
            //     throw new Error('you can not permission for this action');
            // }
            
            const newChannel = await Channel.create(channel);
            if (!newChannel) throw new Error("Can't create channel");

            // const roleEveryone = await ServerRoleGroup.findOne({serverId: channel.serverId, name: "@everyone"});
            // if (!roleEveryone) throw new Error("Can't find role everyone");

            const channelRole = await ChannelRoleGroup.create({name: "everyone", rolePolicies: [channelPolicy.MANAGE_MESSAGE, channelPolicy.VIEW_CHANNEL], channelId: newChannel._id});
            if (!channelRole) throw new Error("Can't create role channel");

            return {
                status: OK,
                data: newChannel
            };
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    getAllByServer: async (id) => {
        try {
            return await Channel.find({ serverId: id});
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    update: async (id, data) =>{
        try {
            const channel = await Channel.findByIdAndUpdate(id, data, {
                new: true
            });
            return {
                status: OK,
                data: channel
            };
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    delete: async (id)=>{
        try {
            await Channel.findByIdAndRemove(id);
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
    get: async(channelId, userId) =>{
        try {
            const channel = await Channel.findById(channelId);
            if (!channel) throw new Error("invalid channel");
            const roles = (await ChannelRoleGroupService.getAll(channelId, userId)).data;

            const messages = await MessageModel.find({
                channelId: channel.id
            }).populate('User', 'fullname avatarUrl')
            return {
                status: OK,
                data: {
                    channel,
                    messages,
                    roles
                }
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    }
};

module.exports = ChannelService;
