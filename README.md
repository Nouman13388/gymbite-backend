# Gymbite

A comprehensive fitness platform backend built with Node.js, Express, TypeScript, and PostgreSQL. Features a React dashboard for administration and includes complete API endpoints for user management, trainer-client relationships, workout plans, meal plans, and progress tracking.

## ✨ Features

### 🏗️ Architecture & Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React + TypeScript + Tailwind CSS v4 + React Router (Dashboard)
- **Authentication**: React Context API with localStorage persistence
- **Styling**: Tailwind CSS v4 with CSS-based configuration
- **Development**: Root-controlled workspace with npm workspaces
- **Security**: Helmet, CORS, rate limiting, compression
- **Deployment**: Vercel-ready with health checks

### 🚀 Core Functionality

- **User Management**: Complete CRUD with Firebase Auth integration
- **Trainer-Client System**: Profile management and relationship tracking
- **Fitness Features**: Workout plans, meal plans, progress tracking
- **Communication**: Consultations, appointments, feedback, notifications
- **Admin Dashboard**: React-based management interface
- **API Documentation**: Comprehensive REST API with validation

## 📋 Prerequisites

- **Node.js** v20.19.0+ (required for Vite)
- **PostgreSQL** database
- **npm** package manager
- **Firebase** project (for authentication)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/gymbite-backend.git
cd gymbite-backend

# Install dependencies (workspace-aware)
npm install

# Generate Prisma client
npx prisma generate
```

### 2. Environment Setup

Create `.env` in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/gymbite?schema=public"

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Firebase Configuration (for dashboard authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
VITE_API_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Optional: Seed with sample data
node populate-data.js
```

### 4. Development

```bash
# Start both backend (3000) and dashboard (5173)
npm run dev

# Backend only
npm run dev:server

# Dashboard only
npm run dev:client
```

## 🏗️ Project Structure

```
gymbite-backend/
├── 📁 src/                    # Backend source code
│   ├── 📁 controllers/        # Route controllers
│   ├── 📁 routes/             # API routes
│   ├── 📁 middleware/         # Custom middleware
│   ├── 📁 database/           # Database connection
│   ├── 📁 types/              # TypeScript definitions
│   └── 📄 index.ts            # Application entry point
├── 📁 dashboard/              # React admin dashboard
│   ├── 📁 src/                # React source code
│   │   ├── 📁 components/     # Reusable components
│   │   │   ├── 📁 ui/         # UI components
│   │   │   └── 📁 layout/     # Layout components
│   │   ├── 📁 pages/          # Page components
│   │   │   ├── 📁 auth/       # Authentication pages
│   │   │   └── Dashboard.tsx  # Main dashboard
│   │   ├── 📁 context/        # React contexts (auth)
│   │   ├── 📁 hooks/          # Custom hooks
│   │   ├── 📁 services/       # API services
│   │   ├── 📁 types/          # TypeScript definitions
│   │   ├── 📁 utils/          # Utility functions
│   │   ├── 📄 App.tsx         # Root component
│   │   ├── 📄 routes.tsx      # Route configuration
│   │   └── 📄 index.css       # Tailwind CSS + theme
│   ├── 📁 public/             # Static assets
│   ├── 📄 vite.config.ts      # Vite configuration
│   ├── 📄 postcss.config.js   # PostCSS + Tailwind config
│   └── 📄 package.json        # Dashboard dependencies
├── 📁 prisma/                 # Database schema & migrations
│   ├── 📄 schema.prisma       # Database schema
│   └── 📁 migrations/         # Migration history
├── 📁 public/                 # Built dashboard (production)
├── 📁 dist/                   # Compiled backend (production)
├── 📄 package.json            # Root package & scripts
├── 📄 tsconfig.json           # TypeScript config
└── 📄 populate-data.js        # Sample data script
```

## 🛠️ Development Workflow

### Root-Controlled Architecture

The project uses **npm workspaces** for centralized dependency management:

```json
{
  "workspaces": ["dashboard"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "tsx watch src/index.ts",
    "dev:client": "npm --workspace=dashboard run dev",
    "build": "npm run build:client && npm run build:server",
    "vercel-build": "prisma generate && npm run build:client && npm run build:server"
  }
}
```

### Development Features

- **🔄 Hot Reload**: Backend auto-restart with `tsx watch`
- **⚡ HMR**: Frontend hot module replacement via Vite
- **🔗 API Proxy**: `/api` requests proxy from `:5173` → `:3000`
- **📦 Workspace Management**: Single `npm install` for everything
- **🏗️ Build Pipeline**: Client → `public/`, Server → `dist/`

## 🎨 Dashboard Architecture

### Authentication System

The dashboard uses React Context API for authentication management:

```typescript
// AuthContext provides:
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
}
```

### Routing & Navigation

- **React Router v6** with centralized route configuration
- **Protected Routes** with authentication guards
- **Type-safe routing** with TypeScript constants

```typescript
// Route structure
/login          // Public - AdminLogin component
/dashboard      // Protected - Main dashboard
/*              // Fallback - 404 page
```

### Styling System

- **Tailwind CSS v4** with CSS-based configuration
- **Custom theme** with dark mode colors
- **Material Icons** integration
- **Inter font** for typography

```css
@theme {
  --color-primary-blue: #1173d4;
  --color-dark-bg: #111418;
  --color-dark-card: #181c22;
  --color-dark-input: #283039;
  --font-family-inter: Inter, "Noto Sans", sans-serif;
}
```

## 📚 API Reference

### 🔗 Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-app.vercel.app/api`

### 🔐 Authentication

Firebase Authentication with Bearer tokens:

```http
Authorization: Bearer <firebase-id-token>
```

### 📊 Core Endpoints

#### Users

| Method   | Endpoint                           | Description              |
| -------- | ---------------------------------- | ------------------------ |
| `GET`    | `/api/users`                       | List all users           |
| `GET`    | `/api/users/:id`                   | Get user by ID           |
| `GET`    | `/api/users/firebase/:firebaseUid` | Get user by Firebase UID |
| `POST`   | `/api/users`                       | Create new user          |
| `PUT`    | `/api/users/:id`                   | Update user              |
| `DELETE` | `/api/users/:id`                   | Delete user              |

#### Trainers

| Method   | Endpoint                     | Description               |
| -------- | ---------------------------- | ------------------------- |
| `GET`    | `/api/trainers`              | List all trainers         |
| `GET`    | `/api/trainers/:id`          | Get trainer profile       |
| `GET`    | `/api/trainers/:id/complete` | Get complete trainer info |
| `GET`    | `/api/trainers/:id/clients`  | Get trainer's clients     |
| `POST`   | `/api/trainers`              | Create trainer profile    |
| `PUT`    | `/api/trainers/:id`          | Update trainer            |
| `DELETE` | `/api/trainers/:id`          | Delete trainer            |

#### Clients

| Method   | Endpoint                    | Description              |
| -------- | --------------------------- | ------------------------ |
| `GET`    | `/api/clients`              | List all clients         |
| `GET`    | `/api/clients/:id`          | Get client profile       |
| `GET`    | `/api/clients/:id/complete` | Get complete client info |
| `POST`   | `/api/clients`              | Create client profile    |
| `PUT`    | `/api/clients/:id`          | Update client            |
| `DELETE` | `/api/clients/:id`          | Delete client            |

#### Workout Plans

| Method   | Endpoint                 | Description         |
| -------- | ------------------------ | ------------------- |
| `GET`    | `/api/workout-plans`     | List workout plans  |
| `GET`    | `/api/workout-plans/:id` | Get workout plan    |
| `POST`   | `/api/workout-plans`     | Create workout plan |
| `PUT`    | `/api/workout-plans/:id` | Update workout plan |
| `DELETE` | `/api/workout-plans/:id` | Delete workout plan |

#### Meal Plans

| Method   | Endpoint              | Description      |
| -------- | --------------------- | ---------------- |
| `GET`    | `/api/meal-plans`     | List meal plans  |
| `GET`    | `/api/meal-plans/:id` | Get meal plan    |
| `POST`   | `/api/meal-plans`     | Create meal plan |
| `PUT`    | `/api/meal-plans/:id` | Update meal plan |
| `DELETE` | `/api/meal-plans/:id` | Delete meal plan |

#### Progress Tracking

| Method   | Endpoint            | Description           |
| -------- | ------------------- | --------------------- |
| `GET`    | `/api/progress`     | List progress records |
| `GET`    | `/api/progress/:id` | Get progress record   |
| `POST`   | `/api/progress`     | Log progress          |
| `PUT`    | `/api/progress/:id` | Update progress       |
| `DELETE` | `/api/progress/:id` | Delete progress       |

#### Communication

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| `GET`  | `/api/consultations` | List consultations |
| `GET`  | `/api/appointments`  | List appointments  |
| `GET`  | `/api/feedback`      | List feedback      |
| `GET`  | `/api/notifications` | List notifications |

### 📝 Request/Response Examples

#### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "CLIENT"
  }'
```

#### Response

```json
{
  "id": 1,
  "firebaseUid": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "CLIENT",
  "createdAt": "2025-09-10T14:30:00.000Z"
}
```

### ❌ Error Handling

```json
{
  "error": "User not found"
}
```

Validation errors:

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## 📦 Sample Data

The project includes a data population script with realistic test data:

### 👥 Sample Users

- **John Doe** (Client): Vegetarian seeking weight loss and muscle building
- **Sarah Smith** (Trainer): 5 years experience in strength training

### 📋 Included Data

- ✅ User profiles with Firebase UIDs
- ✅ Trainer/Client profiles with preferences
- ✅ Workout plan (Beginner Strength Training)
- ✅ Meal plan (Vegetarian Weight Loss - 1800 cal)
- ✅ Scheduled appointments and consultations
- ✅ Progress tracking records
- ✅ Feedback and notifications

### 🎯 Load Sample Data

```bash
node populate-data.js
```

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

#### Backend API

```bash
# Deploy backend to Vercel
npx vercel --prod

# Set environment variables in Vercel dashboard:
DATABASE_URL=your_production_db_url
NODE_ENV=production
CORS_ORIGIN=https://your-dashboard.vercel.app
```

#### Dashboard

```bash
# Deploy dashboard separately (if needed)
cd dashboard
npx vercel --prod

# Or use unified build (dashboard served from backend)
npm run build
npx vercel --prod
```

### Option 2: Unified Server

```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production node dist/index.js

# Dashboard served from http://localhost:3000
```

### 🔒 Production Checklist

- ✅ Set secure `DATABASE_URL`
- ✅ Configure `CORS_ORIGIN`
- ✅ Enable rate limiting
- ✅ Set up monitoring/logging
- ✅ Database backups
- ✅ SSL/TLS certificates

## 🧪 Testing

### API Testing

```bash
# Health check
curl http://localhost:3000/api/health

# List users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test","email":"test@example.com","displayName":"Test User","role":"CLIENT"}'
```

### Dashboard Testing

1. Open `http://localhost:5173`
2. Verify API proxy works (`/api` calls)
3. Test production build: `npm run build` → serve from `:3000`

## 🛠️ Troubleshooting

### Common Issues

#### EBADENGINE Warnings

```bash
# Upgrade Node.js to >= 20.19.0
node -v  # should show 20.19.0+
```

#### Prisma EPERM Errors

```bash
# Clean and regenerate
rm -rf node_modules/.prisma
npm cache clean --force
npm install
npx prisma generate
```

#### Server Won't Start

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Build and run compiled version
npm run build:server
node dist/index.js
```

#### Proxy Not Working

Verify `dashboard/vite.config.ts` proxy configuration:

```typescript
proxy: {
  "/api": {
    target: "http://localhost:3000",
    changeOrigin: true,
    secure: false
  }
}
```

#### Tailwind CSS Not Working

For Tailwind v4, ensure proper configuration:

```javascript
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
```

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-primary-blue: #1173d4;
  /* other custom properties */
}
```

## 🤝 Development

### Scripts Reference

```bash
npm run dev              # Start both servers
npm run dev:server       # Backend only (tsx watch)
npm run dev:client       # Dashboard only (vite dev)
npm run build            # Build both for production
npm run build:server     # Compile TypeScript
npm run build:client     # Build React app → public/
npm start                # Run production server
```

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Node.js, React, TypeScript, Tailwind CSS, and PostgreSQL
