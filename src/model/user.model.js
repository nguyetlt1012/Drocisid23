const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error(`Invalid Email: ${value}`);
      },
    },
    fullname: {
      type: String,
      required: true,
      minLength: 7,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!GENDER.includes(value))
          throw new Error(`Invalid gender: ${value}`);
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "vi-VN"))
          throw new Error(`Invalid phone number: ${value}`);
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    avatarUrl: {
      type: String,
      default: "avt_default.png",
    },
    status: {
      type: Number,
      required: true,
      default: CustomerStatus.ACTIVE,
    },
  },
  {
    collection: "customers",
    timestamps: true,
    strict: true,
  }
);

const UserModel = mongoose.model("user", UserSchema)
module.exports = UserModel