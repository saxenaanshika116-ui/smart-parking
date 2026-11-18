import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';

export default function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', f);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/');
      window.location.reload();
    } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>🌷 Create Account</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input placeholder="Email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input placeholder="Password" type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="primary">Create account</button>
      <p className="muted">Already account hai? <Link to="/login">Login</Link></p>
    </form>
  );
}
