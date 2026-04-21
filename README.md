# 🌐 AlumniSphere – Smart College Alumni Networking & Mentorship Platform

A full-stack, production-ready web application for students and alumni to connect, mentor, and grow professionally. Built with modern technologies and premium SaaS-level design.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Backend](https://img.shields.io/badge/Node.js-Express-green) ![DB](https://img.shields.io/badge/MongoDB-Mongoose-darkgreen) ![Chat](https://img.shields.io/badge/Socket.io-Real--time-purple)

## ✨ Features

### Authentication
- JWT-based login/register with role selection (Student/Alumni/Admin)
- Protected routes and persistent sessions
- Multi-step onboarding flow

### Smart Dashboard
- Analytics cards (connections, mentorships, profile views)
- AI-based mentor recommendations (skill matching)
- Latest opportunities feed
- Trending skills & alumni leaderboard

### Alumni Discovery
- Search with debouncing
- Filter by skills, industry, role
- Match percentage visualization
- Connect/mentor request buttons

### Mentorship System
- Send/accept/reject mentorship requests
- Tabs: All / Sent / Received
- Status tracking (Pending/Accepted/Rejected)
- Auto-connection on acceptance

### Real-Time Messaging
- Socket.io powered chat
- Conversation list with unread counts
- Typing indicators
- Read/delivered status
- Online user tracking

### Opportunities
- Browse jobs, internships, freelance work
- Search and filter by type/skills
- Save/bookmark and apply
- Alumni/Admin can post new opportunities

### Profile
- Editable profile with avatar, skills, bio
- Profile strength meter
- Mentorship history
- Experience & stats display

### Admin Panel
- Platform stats overview
- User management list

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS 3, Framer Motion, React Router 6, Axios, React Hot Toast, Lucide Icons |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.js |
| Real-time | Socket.io |
| Design | Glassmorphism, Gradient theme, Dark mode, Inter/Poppins fonts |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (already included with defaults):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/alumnisphere
JWT_SECRET=alumnisphere_super_secret_key_2024
JWT_EXPIRE=30d
```

Seed the database (optional but recommended):
```bash
node seed.js
```

Start the server:
```bash
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 📝 Demo Accounts

After running `node seed.js`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alumnisphere.com | password123 |
| Alumni | priya@alumni.com | password123 |
| Student | arjun@student.com | password123 |

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth & role guards
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeder
│   ├── socket.js        # Socket.io setup
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       │   └── ui/      # Base components (Button, Card, Modal, etc.)
│       ├── context/     # React contexts (Auth, Theme, Socket)
│       ├── layouts/     # Page layouts
│       ├── pages/       # Page components
│       └── services/    # API service layer
```

## 🎨 Design Features
- Premium glassmorphism cards with backdrop blur
- Gradient theme (indigo → purple → pink)
- Dark/light mode toggle
- Smooth Framer Motion animations
- Skeleton loaders
- Responsive design (mobile + tablet + desktop)
- Modern typography (Inter & Poppins)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/users | Search/list users |
| GET | /api/users/:id | Get user profile |
| PUT | /api/users/profile | Update profile |
| GET | /api/users/recommendations | AI mentor suggestions |
| GET | /api/users/leaderboard | Top alumni |
| GET | /api/users/stats | Dashboard stats |
| GET | /api/users/trending-skills | Trending skills |
| POST | /api/mentorship | Send mentorship request |
| GET | /api/mentorship | Get requests |
| PUT | /api/mentorship/:id | Accept/reject |
| GET | /api/messages/conversations | List conversations |
| GET | /api/messages/:userId | Get messages |
| POST | /api/messages | Send message |
| GET | /api/opportunities | List opportunities |
| POST | /api/opportunities | Create opportunity |
| PUT | /api/opportunities/:id/save | Bookmark |
| PUT | /api/opportunities/:id/apply | Apply |
| GET | /api/notifications | Get notifications |
| PUT | /api/notifications/:id/read | Mark as read |

---

Built with ❤️ for the alumni community.
