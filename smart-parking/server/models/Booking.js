const mongoose = require('mongoose');
module.exports = mongoose.model('Booking', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  vehicleNo: { type: String, required: true, uppercase: true },
  hours: { type: Number, required: true, min: 1 },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
}, { timestamps: true }));
