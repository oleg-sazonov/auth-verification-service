<!-- # Auth Verification Service

Full-stack auth verification service with an Express backend ([backend/src/server.js](backend/src/server.js)) and a Vite React frontend scaffold.

## Prerequisites

-   Node.js 18+
-   npm 9+

## Installation

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Development

```bash
# backend API with nodemon
npm run server

# frontend dev server (Vite) after you scaffold it
npm run frontend
```

## Production Build

```bash
npm run build
```

## Backend Only

```bash
npm run start
```

Health check available at `GET /health` on the backend. -->

# Auth Verification Service

A full-stack authentication verification service with email verification, password reset, and JWT-based authentication.

## 🏗️ Tech Stack

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Mailtrap** for email testing
- **bcrypt** for password hashing

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Zustand** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Mailtrap** account ([Mailtrap.io](https://mailtrap.io/))

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd auth-verification-service
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Environment Setup

#### Backend Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Service (Mailtrap)
MAILTRAP_API_TOKEN=your_mailtrap_api_token_here

# Cookie Security (set to 'true' in production)
COOKIE_SECURE=false

# Frontend Environment Variable
VITE_API_URL=http://localhost:5000
```

### 4. Setup Mailtrap

Follow the detailed guide in [backend/MAILTRAP_SETUP.md](backend/MAILTRAP_SETUP.md) to configure email testing.

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Both Servers Concurrently (Recommended)

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173) servers.

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
npm run frontend
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

## 🏭 Production Build

### Build Frontend

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/dist`.

### Run Backend in Production

```bash
npm run start
```

**Note**: Set `NODE_ENV=production` and `COOKIE_SECURE=true` in your `.env` file for production deployments.

## 📚 Project Structure

```
auth-verification-service/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & environment config
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth & rate limiting middleware
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── mailtrap/         # Email service
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   ├── utils/            # Helper functions
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Application entry point
│   └── package.json
├── .env                      # Environment variables
├── package.json              # Root package.json
└── README.md
```

## 🔑 Key Features

- ✅ User registration with email verification
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Password reset via email
- ✅ Protected routes
- ✅ Rate limiting on sensitive endpoints
- ✅ Responsive UI with animations
- ✅ TypeScript support
- ✅ Email templates for verification & password reset

## 📖 API Documentation

See [frontend/API_INTEGRATION.md](frontend/API_INTEGRATION.md) for complete API documentation.

### Core Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/check-auth` - Check authentication status

## 🧪 Testing

### Test User Registration

1. Start both servers (`npm run dev`)
2. Navigate to [http://localhost:5173/signup](http://localhost:5173/signup)
3. Register with any email
4. Check [Mailtrap Dashboard](https://mailtrap.io/inboxes) for verification email
5. Enter the 6-digit code on the verification page

## 🛠️ Available Scripts

### Root Scripts

- `npm run dev` - Run backend and frontend concurrently
- `npm run server` - Run backend only
- `npm run frontend` - Run frontend only
- `npm run build` - Build frontend for production
- `npm run start` - Run backend in production mode

### Backend Scripts

```bash
cd backend
npm run dev      # Development with nodemon
npm start        # Production mode
```

### Frontend Scripts

```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Security Features

- Password hashing with **bcrypt**
- HTTP-only cookies for JWT tokens
- CSRF protection with SameSite cookies
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Secure password reset flow with expiring tokens

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas network access settings
- Ensure IP address is whitelisted

### Email Not Received

- Check [Mailtrap Dashboard](https://mailtrap.io/inboxes)
- Verify `MAILTRAP_API_TOKEN` in `.env`
- See [backend/MAILTRAP_SETUP.md](backend/MAILTRAP_SETUP.md)

### CORS Errors

- Ensure `CLIENT_URL` matches frontend URL
- Check backend CORS configuration in [backend/src/server.js](backend/src/server.js)

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

## 📝 License

This project is for educational purposes.
