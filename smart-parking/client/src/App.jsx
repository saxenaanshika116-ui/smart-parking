import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Slots from './pages/Slots.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Admin from './pages/Admin.jsx';

export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

function Protected({ children, admin }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

export default function App() {
  const nav = useNavigate();
  const user = getUser();
  const logout = () => { localStorage.clear(); nav('/login'); };

  return (
    <>
      <nav className="nav">
        <b>Smart Parking</b>
        <div>
          {user ? (
            <>
              <Link to="/">Slots</Link>
              <Link to="/my">My Bookings</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <span className="muted">Hi, {user.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Slots /></Protected>} />
          <Route path="/my" element={<Protected><MyBookings /></Protected>} />
          <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
        </Routes>
      </main>
      <footer className="footer">Made by Anshika Saxena</footer>
    </>
  );
}
