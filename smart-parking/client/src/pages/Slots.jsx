import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [type, setType] = useState('');
  const [sel, setSel] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('');
  const [hours, setHours] = useState(1);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/slots', { params: { type } }).then((r) => setSlots(r.data));
  useEffect(() => { load(); }, [type]);

  const book = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', { slotId: sel._id, vehicleNo, hours });
      setMsg(`Slot ${sel.number} book ho gaya!`);
      setSel(null); setVehicleNo(''); setHours(1);
      load();
    } catch (e) { setMsg(errMsg(e)); load(); }
  };

  return (
    <>
      <div className="row">
        <h2>Parking Slots</h2>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>
      </div>
      {msg && <p className="info">{msg}</p>}

      <div className="grid">
        {slots.map((s) => (
          <div
            key={s._id}
            className={`slot ${s.status} ${s.type}`}
            onClick={() => s.status === 'available' && setSel(s)}
          >
            <b>{s.number}</b>
            <small>{s.type === 'car' ? '🚗' : '🏍️'} Floor {s.floor}</small>
            <small>₹{s.ratePerHour}/hr</small>
            <small>{s.status}</small>
          </div>
        ))}
      </div>

      {sel && (
        <form className="card form modal" onSubmit={book}>
          <h3>Book {sel.number}</h3>
          <input placeholder="Vehicle number (UP25AB1234)" required value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
          <input type="number" min="1" max="24" value={hours} onChange={(e) => setHours(e.target.value)} />
          <p>Estimated fee: <b>₹{hours * sel.ratePerHour}</b></p>
          <button className="primary">Confirm booking</button>
          <button type="button" onClick={() => setSel(null)}>Cancel</button>
        </form>
      )}
    </>
  );
}
