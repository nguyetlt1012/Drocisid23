const { Schema, default: mongoose } = require("mongoose");

const ServerSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  channelIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Channel',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  }
},{
  timestamps: true,
});
module.exports = mongoose.model("ServerModel", ServerSchema);
