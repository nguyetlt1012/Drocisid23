const {Schema, default: mongoose} = require('mongoose')
const ChannelRoleGroupSchema = new Schema({
    name: {
        type: String,
    },
    rolePolicies: {
        type: Array,
    }
}, {
    timestamps: true
})

const ChannelRoleGroupModel = new mongoose.model('channel_role_group', ChannelRoleGroupSchema)
module.exports = ChannelRoleGroupModel