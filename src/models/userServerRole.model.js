const { Schema, default: mongoose } = require('mongoose');

const UserServerRoleSchema = new Schema(
  {
    serverId: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serverRoleGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'ServerRoleGroup',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const UserServerRoleModel = new mongoose.model('UserServerRole', UserServerRoleSchema);
module.exports = UserServerRoleModel;
