const mongoose = require("mongoose");
const { Schema } = mongoose;

const matchBlockClickSchema = new mongoose.Schema({
  variationId: {
    type: Number, // A simple identifier for each MatchBlock variation
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MatchClicks", matchBlockClickSchema);
