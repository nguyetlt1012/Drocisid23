const { default: mongoose, SchemaType } = require('mongoose');
const { OK, ERR } = require('../constant/index');
const ChannelModel = require('../models/channel.model');
const ChannelRoleGroupModel = require('../models/channelRoleGroup.model');
const ServerModel = require('../models/server.model');
const ServerRoleGroupModel = require('../models/serverRoleGroup.model');
const UserModel = require('../models/user.model');
const UserChannelRoleModel = require('../models/userChanelRole.model');
const UserServerRoleModel = require('../models/userServerRole.model');
const ChannelService = require('./channel.service');

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
                members: [ownerId]
            });
            if(!newServer) throw new Error(`Cant create Server`)
            // update field serverIds in user
            // const user =  UserModel.findByIdAndUpdate(ownerId, {
            //     $push: {
            //         serverIds: newServer.id
            //     }
            // })

            // create general Channal
            const generalChannel = ChannelService.create({
                serverId: newServer.id,
                name: `General`,
                description: `General channel`,
                userId: ownerId,
                type: 'text'
            })

            // create role @everyone default
            const everyone = await ServerRoleGroupModel.create({
                serverId: newServer.id,
                name: 'everyone',
                rolePolicies: [3, 5]
            })
            if(!everyone) throw new Error(`Cant not create everyone role`)
            // create user_role_server
            const userRoleServer = await UserServerRoleModel.create({
                userId: ownerId,
                serverId:newServer.id,
                serverRoleGroupId: [everyone.id]
            })
            // await Promise.all([user, generalChannel])
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
            // delete server
            const server = await ServerModel.
            deleteOne({
                id: serverId,
                ownerId: ownerId,
            })
            // delete all channel relevant
            await ChannelModel.deleteMany({
                serverId: serverId
            })
            // delete all role-group-server
            await ServerRoleGroupModel.deleteMany({serverId: serverId})
            // delete all role-user-server
            await UserServerRoleModel.deleteMany({serverId:serverId})
            // delete all role-group-channel
            // await ChannelRoleGroupModel.deleteMany({})
            // delete all role-user-channel
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
    update: async(serverId, name, description, isPublic) => {
        try {
            const server =  await ServerModel.findByIdAndUpdate(serverId, {
                name,
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
    getByID: async (id, userId) => {
        try {
            // check is member
            
            const server =  await ServerModel.findById(id)
                .populate('members', 'email fullname avatarUrl')
            if(!server.members.find(x => x._id.toString() === userId))
                throw new Error(`You are not a member of server: ${id}`)
            if(!server) throw new Error(`Cant find Server with id: ${id}`)
            const channels = await ChannelModel.find({
                serverId: id
            }, {
                _id: 1,
                name: 1,
                type: 1
            })
            return {
                status: OK,
                data: {
                    ...server._doc,
                    channels
                }
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
    getAllServerJoinedByUser: async (userId) => {
        try {
            const serverIds = await ServerModel.find({
                members: {
                    $in: userId
                }
            }, {
                name: 1,
            })
            return {
                status: OK,
                data: serverIds
            }
            
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    joinServer: async (userId, serverId) => {
        try {
            // before join, check if they was member of server
            const server = await ServerModel.findById(serverId)
            if(server.members.includes(userId)) throw new Error(`Cant joined server: User: ${userId} was a member of server`)
            server.members.push(userId)
            // if request list contain userId, remove it
            server.requestJoinUsers = server.requestJoinUsers.filter(item => item !== userId)
            // find the everyone role server
            const everyoneRoleServer = await ServerRoleGroupModel.findOne({
                serverId: serverId,
                name: `everyone`,
            })

            // Join all channels of server
            const channels = await ChannelModel.find({
                serverId: serverId
            })
            channels.forEach(channel => {
                channel.users.push(userId)
            })
            //save
            await Promise.all([server.save(), ...channels.map(channel => channel.save())]);

            const addToRoleEveryonePromise = await UserServerRoleModel.create({
                serverId: serverId,
                userId: userId,
                serverRoleGroupId: [everyoneRoleServer.id]
            })
            //  = UserServerRoleModel.updateOne({
            //     serverId: serverId,
            //     name: `everyone`, 
            // }, {
            //     $push: {
            //         userId: userId,
            //     }
            // })
            
            // add it to genaral channel && @everyone role group
            // join all channels public
            // const promise4 = ChannelModel.updateOne({
            //     serverId: serverId,
            //     name: `general channel`
            // }, {
            //     $push: {
            //         users: userId
            //     }
            // })
            // await Promise.all([addToRoleEveryonePromise, server.save()])
            // await server.save();
            return {
                status: OK,
                data: `UserId: ${userId} join server: ${serverId} success`
            }

        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
            
        }
    },
    kickUser: async (userId, serverId) => {
        try {
            const server = await ServerModel.findById(serverId);
            if(!server) throw new Error(`Server is not found by Id: ${serverId}`)
            if(!server.members.includes(userId)) throw new Error(`User: ${userId} not be member of this server`)
            server.members = server.members.filter(item => item !== userId)
            const data = await server.save()
            // erase all role that user were
            const userRole = await UserServerRoleModel.deleteOne({
                userId: userId,
                serverId: serverId
            })
            if(!userRole) throw new Error(`User Role is not found`)
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
    denyUserRequestJoin: async (userIdRequest, serverId) => {
        try {
            const server = await ServerModel.findById(serverId)
            if(!server) throw new Error(`Cant find server with id: ${serverId}`)
            if(!server.requestJoinUsers.includes(userIdRequest)) throw new Error(`User: ${userIdRequest} is not request to join server: ${serverId}`)
            server.requestJoinUsers = server.members.filter(item => item !== userIdRequest);
            const data = await server.save();
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
}

module.exports = ServerService