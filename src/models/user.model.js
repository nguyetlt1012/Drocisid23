const { default: mongoose, Schema } = require('mongoose');
const validator = require('validator');


const GENDER = ['male', 'female'];

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error(`Invalid Email: ${value}`);
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
        if (!GENDER.includes(value)) throw new Error(`Invalid gender: ${value}`);
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      validate(value) {
        if (!validator.isMobilePhone(value, 'vi-VN')) throw new Error(`Invalid phone number: ${value}`);
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    avatarUrl: {
      type: String,
      default: 'avt_default.png',
    },
    status: {
      type: Number,
    },
    requestJoinsServer: {
      type: [Schema.Types.ObjectId],
      ref: 'Server',
      default: [],
    },
  },
  {
    collection: 'users',
    timestamps: true,
    strict: true,
  },
);


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
