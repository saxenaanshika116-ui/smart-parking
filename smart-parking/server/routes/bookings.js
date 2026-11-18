const router = require('express').Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const { protect, adminOnly } = require('../middleware/auth');

// Book a slot
router.post('/', protect, async (req, res) => {
  try {
    const { slotId, vehicleNo, hours } = req.body;
    if (!slotId || !vehicleNo || !hours) return res.status(400).json({ message: 'All fields required' });
    // atomic: only one person can grab an available slot
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { status: 'occupied' },
      { new: true }
    );
    if (!slot) return res.status(400).json({ message: 'Slot not available' });
    const booking = await Booking.create({
      user: req.user.id, slot: slot._id, vehicleNo, hours: Number(hours),
      amount: Number(hours) * slot.ratePerHour,
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// My bookings
router.get('/my', protect, async (req, res) => {
  res.json(await Booking.find({ user: req.user.id }).populate('slot').sort({ createdAt: -1 }));
});

// All bookings (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  res.json(await Booking.find().populate('slot').populate('user', 'name email').sort({ createdAt: -1 }));
});

// Checkout: free the slot, final fee = actual hours (rounded up, min booked hours)
router.put('/:id/checkout', protect, async (req, res) => {
  const b = await Booking.findById(req.params.id).populate('slot');
  if (!b) return res.status(404).json({ message: 'Not found' });
  if (String(b.user) !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not allowed' });
  if (b.status !== 'active') return res.status(400).json({ message: 'Already checked out' });

  b.endTime = new Date();
  const usedHours = Math.ceil((b.endTime - b.startTime) / 36e5);
  b.amount = Math.max(usedHours, b.hours) * b.slot.ratePerHour;
  b.status = 'completed';
  await b.save();
  await Slot.findByIdAndUpdate(b.slot._id, { status: 'available' });
  res.json(b);
});

module.exports = router;
