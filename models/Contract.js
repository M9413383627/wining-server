const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['Parity', 'Sapre', 'Bcone', 'Emerd'] },
  greenContract: { type: Number, default: 0 },
  redContract: { type: Number, default: 0 },
  violetContract: { type: Number, default: 0 },
  contract0: { type: Number, default: 0 },
  contract1: { type: Number, default: 0 },
  contract2: { type: Number, default: 0 },
  contract3: { type: Number, default: 0 },
  contract4: { type: Number, default: 0 },
  contract5: { type: Number, default: 0 },
  contract6: { type: Number, default: 0 },
  contract7: { type: Number, default: 0 },
  contract8: { type: Number, default: 0 },
  contract9: { type: Number, default: 0 },
});

module.exports = mongoose.model('Contract', contractSchema);