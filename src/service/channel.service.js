const Channel = require('../models/channel.model');
const Server = require('../models/server.model');
const UserServerRole = require('../models/userServerRole.model');
const ServerRoleGroup = require('../models/serverRoleGroup.model');
const { serverPolicy, ERR } = require('../constant/index');

const ChannelService = {
    create: async (channel) => {
        try {
            if (channel.serverId) {
                const server = await Server.findOne({ _id: channel.serverId });
                if (!server) {
                    throw new Error('Invalid server');
                }
                const role = await UserServerRole.findOne({ serverId: channel.serverId, userId: channel.userId });
                if (!role) {
                    throw new Error('Invalid server role');
                }

                const policy = await ServerRoleGroup.findOne({ _id: role.serverRoleGroupId });
                if (!policy) {
                    throw new Error('Invalid server role group');
                }
                if (!policy.rolePolicies.includes(serverPolicy.MANAGE_CHANNEL)) {
                    throw new Error('you can not permission for this action');
                }
            }

            const newChannel = await Channel.create(channel);
            return newChannel;
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
    }
};

module.exports = ChannelService;
