const { Schema, default: mongoose } = require("mongoose");

const ServerSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  channelIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Channel',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  userIds: {
    type: [Schema.Types.ObjectId],
  },
  //list invite link to server
  inviteLinkIds: {
    type: Schema.Types.Array,
  },
  requestJoinUsers: {
    type: Array,
  }
},{
  timestamps: true,
});
const ServerModel = new mongoose.model("server", ServerSchema)
module.exports = ServerModel
