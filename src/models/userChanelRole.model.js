const { Schema, default: mongoose } = require('mongoose');

const UserChannelRoleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    channelId: {
      type: Schema.Types.ObjectId,
    },
    channelRoleGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'ChannelRoleGroup',
    },
  },
  {
    timestamps: true,
  },
);

const UserChannelRoleModel = new mongoose.model('UserChannelRole', UserChannelRoleSchema);
module.exports = UserChannelRoleModel;
