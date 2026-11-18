# Smart Parking Management System (MERN)

**Stack:** MongoDB, Express, React (Vite), Node.js, JWT auth

## Features
- User register / login (JWT + bcrypt)
- Live slot grid (car/bike filter), green = available, red = occupied
- Slot booking with vehicle number, hours, estimated fee (race-condition safe)
- Checkout: slot free ho jata hai, final fee calculate hoti hai
- Admin dashboard: stats (total/available/occupied/revenue), slot add/delete, all bookings

## Run karne ke steps
1. MongoDB install/start karein (ya Atlas URI `.env` mein daalein)
2. Backend:
   ```
   cd server
   cp .env.example .env
   npm install
   npm run seed      # admin + 24 demo slots
   npm run dev       # http://localhost:5000
   ```
3. Frontend (naye terminal mein):
   ```
   cd client
   npm install
   npm run dev       # http://localhost:5173
   ```
4. Admin login: `admin@parking.com` / `admin123`

## API
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /login | public |
| GET | /api/slots | public |
| GET | /api/slots/stats | admin |
| POST/DELETE | /api/slots, /api/slots/:id | admin |
| POST | /api/bookings | user |
| GET | /api/bookings/my | user |
| PUT | /api/bookings/:id/checkout | owner/admin |
| GET | /api/bookings | admin |
