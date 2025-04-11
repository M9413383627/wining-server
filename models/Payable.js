const mongoose = require('mongoose');

const payableSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['Parity', 'Sapre', 'Bcone', 'Emerd'] },
  payable0: { type: Number, default: 0 },
  payable1: { type: Number, default: 0 },
  payable2: { type: Number, default: 0 },
  payable3: { type: Number, default: 0 },
  payable4: { type: Number, default: 0 },
  payable5: { type: Number, default: 0 },
  payable6: { type: Number, default: 0 },
  payable7: { type: Number, default: 0 },
  payable8: { type: Number, default: 0 },
  payable9: { type: Number, default: 0 },
});

module.exports = mongoose.model('Payable', payableSchema);