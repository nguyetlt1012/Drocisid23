const {Schema, default: mongoose} = require('mongoose')
const ServerRoleGroupSchema = new Schema({
    name: {
        type: String,
    },
    rolePolicies: {
        type: Array,
    }
}, {
    timestamps: true
})

const ServerRoleGroupModel = new mongoose.model('server_role_group', ServerRoleGroupSchema)
module.exports = ServerRoleGroupModel