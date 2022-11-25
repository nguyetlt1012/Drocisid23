const {mongoose, Schema} = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const GENDER = ['male', 'female'];

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
    },
    serverIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Server',
      default: [],
    }
  },
  {
    collection: "users",
    timestamps: true,
    strict: true,
  }
);


// ENCRYPT PASSWORD BEFORE SAVING TO DB
UserSchema.pre('save', async function (next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// INSTANCE METHOD: Check password to login
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel = mongoose.model("user", UserSchema)
module.exports = UserModel