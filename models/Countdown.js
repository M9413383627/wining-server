const mongoose = require('mongoose');

const countdownSchema = new mongoose.Schema({
  endTime: { type: Number, required: true }, // Unix timestamp in milliseconds
});

module.exports = mongoose.model('Countdown', countdownSchema);