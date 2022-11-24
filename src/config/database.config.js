const mongoose = require('mongoose')

const mongoConnect = async ()=> {
    return mongoose.connect(process.env.MONGODB_URI)
}

module.exports = {
    mongoConnect
}