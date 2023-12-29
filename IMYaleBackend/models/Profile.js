/**
 * Mongoose model for Profile.
 * 
 * @module Profile
 * @requires mongoose
 * 
 * @description
 * Represents a user's profile in the database, specifically tailored for Yale students.
 * This model includes personal information, such as name and academic details, as well as
 * references to other models like `BaseUser`, `Chat`, and `Game`.
 * 
 * @typedef {Object} Profile
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the BaseUser model.
 * @property {String} username - Unique username for the profile.
 * @property {mongoose.Schema.Types.ObjectId[]} chats - References to Chat model.
 * @property {mongoose.Schema.Types.ObjectId[]} games - References to Game model, with an array of game IDs.
 * @property {String} first_name - The first name of the user.
 * @property {String} middle_name - The middle name of the user.
 * @property {String} last_name - The last name of the user.
 * @property {String} preferred_name - The preferred name of the user.
 * @property {String} netid - The NetID associated with the user.
 * @property {String} college - The college of the user.
 * @property {String} major - The major of the user.
 * @property {String} year - The academic year of the user.
 * @property {String} profilePic - The URL of the user's profile picture.
 */
const mongoose = require("mongoose");
// Profile for Yale students
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BaseUser",
        required: true,
    },
    username: {
        type: String,
        required: [true, "Please provide username"],
        unique: true,
        minlength: 3,
        maxlength: 50,
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    }],
    games: {
        type: [mongoose.Schema.Types.ObjectId], default: [],
        ref: "Game",
    },
    first_name: { type: String},
    middle_name: { type: String},
    last_name: { type: String},
    preferred_name: { type: String},
    netid: { type: String},
    college: { type: String},
    major: { type: String},
    year: { type: String},
    profilePic: { type: String}
});

module.exports = mongoose.model("Profile", ProfileSchema);