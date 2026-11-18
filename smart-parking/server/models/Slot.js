const mongoose = require('mongoose');
module.exports = mongoose.model('Slot', new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  floor: { type: Number, default: 0 },
  type: { type: String, enum: ['car', 'bike'], default: 'car' },
  ratePerHour: { type: Number, default: 20 },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
}, { timestamps: true }));
