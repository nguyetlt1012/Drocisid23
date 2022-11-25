const { Schema, default: mongoose } = require("mongoose");

const TYPES = ['text', 'voice'];
const ChannelSchema = new Schema({
  name:{
    type: String,
    require: true,
  },
  userIds: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  type:{
    type: String,
    require: true,
    validate(value){
      if (!TYPES.includes(value))
        throw new Error('Invalid type channel');
    }
  },
  serverId: {
    type: Schema.Types.ObjectId,
    ref: 'Server'
  }
},{
  timestamps: true,
});

const ChannelModel = mongoose.model("channel", ChannelSchema);
module.exports = ChannelModel;
