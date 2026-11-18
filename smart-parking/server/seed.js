require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Slot = require('./models/Slot');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({ email: 'admin@parking.com' });
  await User.create({
    name: 'Admin', email: 'admin@parking.com',
    password: await bcrypt.hash('admin123', 10), role: 'admin',
  });
  await Slot.deleteMany({});
  const slots = [];
  for (let f = 0; f < 2; f++) {
    for (let i = 1; i <= 8; i++) slots.push({ number: `F${f}-C${i}`, floor: f, type: 'car', ratePerHour: 30 });
    for (let i = 1; i <= 4; i++) slots.push({ number: `F${f}-B${i}`, floor: f, type: 'bike', ratePerHour: 10 });
  }
  await Slot.insertMany(slots);
  console.log('Seeded. Admin -> admin@parking.com / admin123');
  process.exit();
})();
