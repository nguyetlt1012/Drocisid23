const { Schema, default: mongoose } = require("mongoose");

const UserRoleSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  channelId: {
    type: Schema.Types.ObjectId,
  },
  channelRoleGroupArr: {
    type: Array,
  },
}, {
    timestamps: true,
});

const UserRoleModel = new mongoose.model("user_role", UserRoleSchema)
module.exports = UserRoleModel
