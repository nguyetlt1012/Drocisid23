const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { ERR, OK } = require('../constant');
const InviteModel = require('../models/invite.model');
const ServerModel = require('../models/server.model');

const UserService = {
    create: async (user) => {
        try {
            user.password = await bcrypt.hash(user.password, 12);
            const newUser = await User.create(user);
            newUser.password = undefined;
            // create primary server
            const newPrimaryServer = await ServerModel.create({
                name: 'Primary-Server',
                description: 'Server for message user to user, friends',
                memberIDs: [newUser.id]
            })
            if(!newPrimaryServer) throw new Error(`Cant create Primary-Server`)
            // console.log(newPrimaryServer)
            return {
                status: OK,
                data: newUser
            };
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    getByEmail: async (email) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    getById: async (id) =>{
        try {
            const user = await User.findById(id);
            user.password = undefined
            return {
                status: OK,
                data: user
            };
        } catch (error) {
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    resetPassword: async (email, password, userId) => {
        try{
           const user = await User.findOne({_id: userId, email: email});
           if (!user) throw new Error('Can not find user by email');
           user.password = await bcrypt.hash(password, 12); 
           await user.save({ validateBeforeSave: false });
           user.password = undefined;
           return user;
        }catch(error){
            return {
                status: ERR,
                message: error.message,
            };
        }
    },
    requestJoinServer: async (userId, serverId) => {
        try {
            const server = await ServerModel.findById(serverId)
            if(!server) throw new Error(`Can not find server with ID: ${serverId}`)
            
            // check user belonged to server ?
            if(server.memberIDs.includes(userId)) throw new Error(`User was a member of server: ${serverId}`)
            // check if user requested join server
            if(server.requestJoinUsers.includes(userId)) throw new Error(`You already make a requested not long ago to join this server`)
            server.requestJoinUsers.push(userId);
            await server.save();
            return {
                status: OK,
                data: {}
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    }
};

module.exports = UserService;
