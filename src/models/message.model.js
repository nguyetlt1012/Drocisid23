const { Schema, default: mongoose } = require('mongoose');

const MessageSchema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    // //chanelId or personalId
    // destination: {
    //   type: Schema.Types.ObjectId,
    //   require: true,
    // },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;
