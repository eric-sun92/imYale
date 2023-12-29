/**
 * Mongoose model for Session.
 * 
 * @module Session
 * @requires mongoose
 * 
 * @description
 * Represents a session in the database. This model is used to store session information for users,
 * including the session token and its expiration date. Each session is associated with a specific user.
 * 
 * @typedef {Object} Session
 * @property {mongoose.Schema.Types.ObjectId} userId - The ObjectId of the user to whom the session belongs.
 * @property {String} token - The session token, unique for each session.
 * @property {Date} expires - The expiration date of the session.
 */
const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Session", SessionSchema);
