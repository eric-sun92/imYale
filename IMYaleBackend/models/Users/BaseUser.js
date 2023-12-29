
/**
 * Mongoose model for BaseUser.
 * 
 * @module BaseUser
 * @requires mongoose
 * @requires validator
 * 
 * @description
 * This model represents the base user in the database. It includes fields for username, profile, 
 * email, roles, and verification status. It uses a discriminator key for inheritance, allowing 
 * other user types to extend from this base schema.
 * 
 * @typedef {Object} BaseUser
 * @property {String} username - Unique username for the user.
 * @property {mongoose.Schema.Types.ObjectId} profile - Reference to the Profile model.
 * @property {String} email - Unique email for the user, validated for format.
 * @property {String[]} roles - Array of roles assigned to the user, default is ["default"].
 * @property {Date} verified - Date when the user was verified.
 */

const mongoose = require("mongoose");
const validator = require("validator");
const baseOptions = {
    discriminatorKey: "type",
    collection: "users",
};

const baseUserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide username"],
            unique: true,
            minlength: 3,
            maxlength: 50,
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
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
        roles: {
            type: [String],
            default: ["default"],
        },
        verified: Date,
    }, baseOptions
);

module.exports = mongoose.model("BaseUser", baseUserSchema);