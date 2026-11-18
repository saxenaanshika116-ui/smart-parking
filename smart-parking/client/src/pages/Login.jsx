import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';

export default function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', f);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/');
      window.location.reload();
    } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Welcome Back</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input placeholder="Password" type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="primary">Login</button>
      <p className="muted">Naya user? <Link to="/register">Register karein</Link></p>
    </form>
  );
}
