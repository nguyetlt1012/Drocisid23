const { Schema, default: mongoose } = require('mongoose');

const InviteSchema = new Schema(
  {
    inviteLink: {
      type: String,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      require: true,
    },

    //unit: minute
    expireTime: {
      type: Date,
      require: true,
      default: 7*24*60,
    },
    source: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    //channel invite or server invite
    //channel: 1
    //server: 0
    inviteType: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  },
);
const InviteModel = new mongoose.model('Invite', InviteSchema);
module.exports = InviteModel;
