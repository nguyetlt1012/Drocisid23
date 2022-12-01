const { Schema, default: mongoose } = require("mongoose");

const ServerMemberSchema = new Schema({
  server_id: {
    type: Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roleIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Role',
    default: [],
    required: true,
  }
},{
  timestamps: true,
});
const ServerMemberModel = new mongoose.model('server_member', ServerMemberSchema)
module.exports = ServerMemberModel