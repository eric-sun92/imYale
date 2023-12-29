/**
 * Mongoose model for Announcement.
 * 
 * @module Announcement
 * @requires mongoose
 * 
 * @description
 * Represents an announcement in the database. Each announcement is linked to messages and
 * optionally to a game. This model is used to store and manage data related to announcements
 * made in the application, such as game announcements or general notifications.
 * 
 * @typedef {Object} Announcement
 * @property {mongoose.Schema.Types.ObjectId[]} messages - Array of ObjectIds referencing the Message model.
 * @property {mongoose.Schema.Types.ObjectId} game - ObjectId referencing the Game model.
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    game: { type: Schema.Types.ObjectId, ref: 'Game' },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);