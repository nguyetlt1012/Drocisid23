const { Schema, default: mongoose } = require('mongoose');
const ServerRoleGroupSchema = new Schema(
  {
    name: {
      type: String,
    },
    rolePolicies: {
      type: Array,
    },
    serverId: {
      type: [Schema.Types.ObjectId],
      ref: 'Server',
    },
  },
  {
    timestamps: true,
  },
);

const ServerRoleGroupModel = mongoose.model('ServerRoleGroup', ServerRoleGroupSchema);
module.exports = ServerRoleGroupModel;
