<<<<<<< HEAD
const mongoose = require("mongoose");

const mongoConnect =  (db) => {
  return mongoose
    .connect(db)
    .then((data) => console.log(data))
    .catch((err) => {
      return new Error(err.message);
    });
};

module.exports = {
  mongoConnect
=======
const mongoose = require('mongoose');

const mongoConnect = async () => {
    return mongoose.connect(process.env.MONGODB_URI);
};

module.exports = {
    mongoConnect,
>>>>>>> nguyet
};
