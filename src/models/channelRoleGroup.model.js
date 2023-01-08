const { Schema, default: mongoose } = require('mongoose');
const ChannelRoleGroupSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    rolePolicies: {
      type: Array,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      require: true
    },
    memberIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  {
    timestamps: true,
  },
);

const ChannelRoleGroupModel = mongoose.model('ChannelRoleGroup', ChannelRoleGroupSchema);
module.exports = ChannelRoleGroupModel;
