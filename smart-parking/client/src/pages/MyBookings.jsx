import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function MyBookings() {
  const [list, setList] = useState([]);
  const load = () => api.get('/bookings/my').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const checkout = async (id) => {
    try { await api.put(`/bookings/${id}/checkout`); load(); }
    catch (e) { alert(errMsg(e)); }
  };

  return (
    <>
      <h2> My Bookings</h2>
      <table>
        <thead><tr><th>Slot</th><th>Vehicle</th><th>Start</th><th>Hours</th><th>Amount</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {list.map((b) => (
            <tr key={b._id}>
              <td>{b.slot?.number}</td>
              <td>{b.vehicleNo}</td>
              <td>{new Date(b.startTime).toLocaleString()}</td>
              <td>{b.hours}</td>
              <td>₹{b.amount}</td>
              <td>{b.status}</td>
              <td>{b.status === 'active' && <button onClick={() => checkout(b._id)}>Checkout</button>}</td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan="7">Koi booking nahi hai</td></tr>}
        </tbody>
      </table>
    </>
  );
}
