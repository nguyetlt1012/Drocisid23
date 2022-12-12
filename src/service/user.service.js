const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const UserService = {
    create: async (user) => {
        try {
            user.password = await bcrypt.hash(user.password, 12);
            const newUser = await User.create(user);
            newUser.password = undefined;
            return newUser;
        } catch (error) {
            return {
                status: 'Err',
                message: error.message,
            };
        }
    },
    getByEmail: async (email) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {}
    },
};

module.exports = UserService;
