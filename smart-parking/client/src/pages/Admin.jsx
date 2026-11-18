import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function Admin() {
  const [stats, setStats] = useState({});
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [f, setF] = useState({ number: '', floor: 0, type: 'car', ratePerHour: 20 });

  const load = () => {
    api.get('/slots/stats').then((r) => setStats(r.data));
    api.get('/slots').then((r) => setSlots(r.data));
    api.get('/bookings').then((r) => setBookings(r.data));
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try { await api.post('/slots', f); setF({ ...f, number: '' }); load(); }
    catch (e) { alert(errMsg(e)); }
  };
  const del = async (id) => {
    try { await api.delete(`/slots/${id}`); load(); }
    catch (e) { alert(errMsg(e)); }
  };

  return (
    <>
      <h2>Admin Dashboard</h2>
      <div className="stats">
        <div className="card">Total<b>{stats.total}</b></div>
        <div className="card">Available<b>{stats.available}</b></div>
        <div className="card">Occupied<b>{stats.occupied}</b></div>
        <div className="card">Revenue<b>₹{stats.revenue}</b></div>
      </div>

      <h3>Add Slot</h3>
      <form className="row" onSubmit={add}>
        <input placeholder="Slot no. (F0-C9)" required value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} />
        <input type="number" placeholder="Floor" value={f.floor} onChange={(e) => setF({ ...f, floor: e.target.value })} />
        <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
          <option value="car">Car</option><option value="bike">Bike</option>
        </select>
        <input type="number" placeholder="Rate/hr" value={f.ratePerHour} onChange={(e) => setF({ ...f, ratePerHour: e.target.value })} />
        <button className="primary">Add</button>
      </form>

      <h3>Slots</h3>
      <table>
        <thead><tr><th>No.</th><th>Type</th><th>Floor</th><th>Rate</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s._id}>
              <td>{s.number}</td><td>{s.type}</td><td>{s.floor}</td><td>₹{s.ratePerHour}</td><td>{s.status}</td>
              <td><button onClick={() => del(s._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>All Bookings</h3>
      <table>
        <thead><tr><th>User</th><th>Slot</th><th>Vehicle</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.user?.name}</td><td>{b.slot?.number}</td><td>{b.vehicleNo}</td><td>₹{b.amount}</td><td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
