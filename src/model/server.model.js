const {Schema, default: mongoose} = require('mongoose')

const ServerSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    channels: {
        type: Array,
    },
    members: {
        type: Array,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
    },

    // user can apply to server, server can invites to user
    invites: {
        type: Array,
    }
})