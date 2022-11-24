const {Schema, default: mongoose} = require('mongoose')

const MessageSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    author_id: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    //chanelId or personalId
    destination: {
        type: Schema.Types.ObjectId,
        require: true,
    }
})

const MessageModel = new mongoose.Model(MessageSchema)
module.exports = MessageModel