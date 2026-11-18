const router = require('express').Router();
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  res.json(await Slot.find(filter).sort({ floor: 1, number: 1 }));
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  const total = await Slot.countDocuments();
  const occupied = await Slot.countDocuments({ status: 'occupied' });
  const revenueAgg = await Booking.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, sum: { $sum: '$amount' } } },
  ]);
  res.json({ total, occupied, available: total - occupied, revenue: revenueAgg[0]?.sum || 0 });
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Slot.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.code === 11000 ? 'Slot number already exists' : e.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ message: 'Not found' });
  if (slot.status === 'occupied') return res.status(400).json({ message: 'Slot is occupied' });
  await slot.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
