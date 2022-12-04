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
};
