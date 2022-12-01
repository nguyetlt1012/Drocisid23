const { Schema, default: mongoose } = require("mongoose");

const TYPES = ['text', 'voice'];
const ChannelSchema = new Schema({
  name:{
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  userIds: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  role_group: {
    type: Array,
    default: []
  },
  type:{
    type: String,
    require: true,
    validate(value){
      if (!TYPES.includes(value))
        throw new Error('Invalid type channel');
    }
  },
  //user cant join channel from invite link unless they belong to this server
  inviteLinkIds: {
    type: Array,
  }
},{
  timestamps: true,
});

const ChannelModel = mongoose.model("channel", ChannelSchema);
module.exports = ChannelModel;
