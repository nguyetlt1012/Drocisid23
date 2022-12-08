const { Schema, default: mongoose } = require('mongoose');
const ChannelRoleGroupSchema = new Schema(
  {
    name: {
      type: String,
    },
    rolePolicies: {
      type: Array,
    },
    channelId: {
      type: [Schema.Types.ObjectId],
      ref: 'Channel',
    },
  },
  {
    timestamps: true,
  },
);

const ChannelRoleGroupModel = new mongoose.model('ChannelRoleGroup', ChannelRoleGroupSchema);
module.exports = ChannelRoleGroupModel;
