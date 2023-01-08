const { OK, ERR } = require('../constant/index');
const ChannelModel = require('../models/channel.model');
const ServerModel = require('../models/server.model');
const UserModel = require('../models/user.model');

const ServerService = {
    create: async (ownerId, name, description, isPublic) => {
        try {
            // create newServer on db
            console.log(ownerId);
            const newServer = await ServerModel.create({
                ownerId,
                name,
                description,
                isPublic
            });
            if(!newServer) throw new Error(`Cant create Server`)
            // update field serverIds in user
            const user = await UserModel.findByIdAndUpdate(ownerId, {
                $push: {
                    serverIds: newServer.id
                }
            })
            if(!user) throw new Error(`Cant update field serverIds`)
            // create general Channal
            const generalChannel = new ChannelModel.create({
                serverId: newServer.id,
                description: `General channel`,
                userIds: [ownerId]
            })
            if(!generalChannel) throw new Error(`Cant create genaral Server`)
            return {
                status: OK,
                data: newServer
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
        }
    },
    delete: async(serverId, ownerId) => {
        try {
            const server = await ServerModel.deleteOne({
                id: serverId,
                ownerId: ownerId,
            })
            if(!server) throw new Error(`ServerId: ${serverId} or OwnerId: ${ownerId} is not matching`)
            return {
                status: OK,
                data: serverId
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    modify: async(serverId, dataReq) => {
        try {
            const server =  await ServerModel.updateOne({id: serverId}, {
                name: dataReq.name,
                description: dataReq.description,
                isPublic: dataReq.isPublic
            })
            if(!server) throw new Error(`Cant found server with Id: ${serverId}`)
            return {
                status: OK,
                data: server
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
        }
    },
    getOwnerServerById: async (serverId) => {
        try {
            const ownerId = await ServerModel.findById(serverId).populate('ownerId')
            if(!ownerId) throw new Error(`Cant found the ownerId of Server with serverId: ${serverId}`)
            return {
                status: OK,
                data: ownerId
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
            
        }
    },
    getByID: async (id) => {
        try {
            const server =  await ServerModel.findById(id);
            return {
                status: OK,
                data: server
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
        }
    },
    getAll: async(dataReq) => {
        try {
            const servers = await ServerModel.findAll(dataReq);
            return {
                status: OK,
                data: servers,
            }
            
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
        }
    },
    getAllCreatedByUser: async(dataReq) => {
        try {
            
        } catch (error) {
            
        }
    },
    getAllServerJoinedByUser: async (dataReq) => {
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = ServerService