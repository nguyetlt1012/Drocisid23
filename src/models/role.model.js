const { Schema, default: mongoose } = require("mongoose");
const { PermissionsTypes } = require("../constant/PermissionTypes");
const validator = require("validator");

const RoleSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  server_id: {
    type: Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  permissions: {
    type: Number,
    default: PermissionsTypes.MANAGE_ROLES,
    required: [true, 'Permissions is required'],
    validate: [validator.isInteger, 'Invalid permissions integer'],
  },
},{
  timestamps: true,
});
module.exports = mongoose.model("RoleModel", RoleSchema);
