const { OK, ERR } = require('../constant/index');
const ChannelModel = require('../models/channel.model');
const ServerModel = require('../models/server.model');
const UserModel = require('../models/user.model');
const UserChannelRoleModel = require('../models/userChanelRole.model');
const UserServerRoleModel = require('../models/userServerRole.model');

const ServerService = {
    create: async (ownerId, name, description, isPublic) => {
        try {
            // create newServer on db
            // make transaction
            const newServer = await ServerModel.create({
                ownerId,
                name,
                description,
                isPublic,
                memberIDs: [ownerId]
            });
            if(!newServer) throw new Error(`Cant create Server`)
            // update field serverIds in user
            const user =  UserModel.findByIdAndUpdate(ownerId, {
                $push: {
                    serverIds: newServer.id
                }
            })
            // create general Channal
            const generalChannel =  ChannelModel.create({
                serverId: newServer.id,
                name: `General`,
                description: `General channel`,
                userIds: [ownerId]
            })
            await Promise.all([user, generalChannel])
            return {
                status: OK,
                data: newServer
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
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
    update: async(serverId, description, isPublic) => {
        try {
            const server =  await ServerModel.updateOne({id: serverId}, {
                description,
                isPublic,
            })
            if(!server) throw new Error(`Cant found server with Id: ${serverId}`)
            return {
                status: OK,
                data: server
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
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
                data: error.message
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
                data: error.message
            }
        }
    },
    getServersPulic: async(page, limit, keyword) => {
        try {
            const servers = await ServerModel.find({
                isPublic: true,
                name: {
                    $regex: keyword
                }
            }, {
                name: 1,
                description: 1,
                ownerId: 1,
            }, {
                skip: (page - 1)*limit,
                limit: limit
            })
            return {
                status: OK,
                data: servers,
            }
            
        } catch (error) {
            return {
                status: ERR,
                data: error.message
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
    },
    joinServer: async (userId, serverId) => {
        try {
            // before join, check if they was member of server
            const isMember = await ServerModel.findOne({
                id: serverId,
                memberIDs: {
                    $in: userId
                }
            })
            if(isMember) throw new Error(`User: ${userId} was a member of server`)
            // then, add it to server
            const promise1 = ServerModel.updateOne({
                id: serverId
            }, {
                $push: {
                    memberIDs: userId
                }
            })
            const promise2 = await UserModel.updateOne({
                id: userId
            }, {
                $push: {
                    serverIds: serverId
                }
            })
            // console.log(promise2)
            const promise3 = UserServerRoleModel.updateOne({
                serverId: serverId,
                name: `everyone`, 
            }, {
                $push: {
                    userId: userId,
                }
            })
            
            // add it to genaral channel && @everyone role group
            // join channel
            const promise4 = ChannelModel.updateOne({
                serverId: serverId,
                name: `general channel`
            }, {
                $push: {
                    userIds: userId
                }
            })
            const res = await Promise.all([promise1, promise3, promise4])
            return {
                status: OK,
                data: `UserId: ${userId} joined server: ${serverId}`
            }

        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
            
        }
    },
    getRequestJoin: async (id) => {
        // assurance request belong to server
        
    }
}

module.exports = ServerService