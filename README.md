# Travel Agency Website

A full-stack travel agency management system built with Vite (React), Node.js, and MongoDB.

## Features

- User Authentication (Client, Agency, Admin)
- Dashboard for different user roles
- CRUD operations for travel packages
- Booking management
- User profile management

## Tech Stack

- Frontend: Vite + React
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT

## Project Structure

```
travel-agency/
├── client/          # Frontend (Vite + React)
├── server/          # Backend (Node.js + Express)
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file and add:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travel-agency
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Travel Packages
- GET /api/packages
- POST /api/packages
- PUT /api/packages/:id
- DELETE /api/packages/:id

### Bookings
- GET /api/bookings
- POST /api/bookings
- PUT /api/bookings/:id
- DELETE /api/bookings/:id

## License

MIT 