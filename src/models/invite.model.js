const { Schema, default: mongoose } = require('mongoose');

const InviteSchema = new Schema(
  {
    inviteLink: {
      type: String,
    },
    expireTime: {
      type: Date,
    },
    source: {
      type: Schema.Types.ObjectId,
    },
    destination: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);
const InviteModel = new mongoose.model('Invite', InviteSchema);
module.exports = InviteModel;
