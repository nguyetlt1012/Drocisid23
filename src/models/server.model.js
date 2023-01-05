const { Schema, default: mongoose } = require('mongoose');

const ServerSchema = new Schema(
  {
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
      default: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    //list invite link to server
    inviteLinkIds: {
      type: Schema.Types.Array,
    },
    memberIDs: {
      type: Schema.Types.Array,
      ref: 'User',
      require: true,
    },
    requestJoinUsers: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
);
const ServerModel = mongoose.model('Server', ServerSchema);
module.exports = ServerModel;
