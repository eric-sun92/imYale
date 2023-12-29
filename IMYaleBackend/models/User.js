/**
 * Mongoose model for User.
 * 
 * @module User
 * @requires mongoose
 * @requires validator
 * @requires bcryptjs
 * 
 * @description
 * Represents a user in the database. This model includes fields for the user's name, email,
 * password, role, and verification status. Passwords are hashed using bcryptjs before saving.
 * The model also includes methods for password comparison and hooks for pre-save actions.
 * 
 * @typedef {Object} User
 * @property {String} name - The name of the user.
 * @property {String} email - The email of the user, must be unique.
 * @property {String} password - The hashed password of the user.
 * @property {String} role - The role of the user, either 'admin' or 'user'.
 * @property {String} verificationToken - Token used for verifying the user's email.
 * @property {Boolean} isVerified - Indicates whether the user's email is verified.
 * @property {Date} verified - The date when the user's email was verified.
 * @property {String} passwordToken - Token used for password reset.
 * @property {Date} passwordTokenExpirationDate - Expiration date for the password reset token.
 */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
