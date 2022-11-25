const {Schema, default: mongoose} = require('mongoose')

const InviteSchema = new Schema({
    source: {
        type: Schema.Types.ObjectId,
    },
    destination: {
        type: Schema.Types.ObjectId,
    },
})
module.exports = mongoose.model("InviteModel", InviteSchema);