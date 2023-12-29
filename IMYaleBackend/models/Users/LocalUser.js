const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const BaseUser = require("./BaseUser");

const UserSchema = new mongoose.Schema({
        password: {
          type: String,
          required: [true, "Please provide password"],
          minlength: 8,
        },
        verificationToken: String,
        isVerified: {
          type: Boolean,
          default: false,
        },
        passwordToken: {
          type: String,
        },
        passwordTokenExpirationDate: {
          type: Date,
        },
    })

UserSchema.pre("save", async function (next) {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};


module.exports = BaseUser.discriminator(
    "LocalUser",
    UserSchema
);
