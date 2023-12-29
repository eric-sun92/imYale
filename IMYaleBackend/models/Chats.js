const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

module.exports = mongoose.model('Chat', ChatSchema);