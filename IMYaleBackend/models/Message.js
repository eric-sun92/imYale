/**
 * Mongoose model for Message.
 * 
 * @module Message
 * @requires mongoose
 * 
 * @description
 * Represents a message in the database. This model includes the message text, sender,
 * timestamp, and any replies. The 'visibility' field specifies the accessibility of the message,
 * which can be 'private' or other predefined types.
 * 
 * @typedef {Object} Message
 * @property {String} text - The content of the message.
 * @property {mongoose.Schema.Types.ObjectId} sender - Reference to the Profile model of the sender.
 * @property {Date} timestamp - The timestamp when the message was sent, defaults to current time.
 * @property {mongoose.Schema.Types.ObjectId[]} replies - Array of ObjectIds referencing replies to this message.
 * @property {String} visibility - The visibility status of the message, defaults to 'private'.
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    text: String,
    sender: { type: Schema.Types.ObjectId, ref: 'Profile' },
    timestamp: { type: Date, default: Date.now },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    visibility: { type: String, default: 'private'}
});


module.exports = mongoose.model('Message', MessageSchema);