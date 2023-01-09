const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { ERR, OK } = require('../constant');
const InviteModel = require('../models/invite.model');

const UserService = {
    create: async (user) => {
        try {
            user.password = await bcrypt.hash(user.password, 12);
            const newUser = await User.create(user);
            newUser.password = undefined;
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
    joinWithLink: async (inviteCode) => {
        try {
            const invite = await InviteModel.findOne({inviteCode: inviteCode})
            if(!invite) throw new Error(`Invite: ${inviteCode} code/link is not correct`)
            // add to member of servers
        } catch (error) {
            
        }
    }
};

module.exports = UserService;
