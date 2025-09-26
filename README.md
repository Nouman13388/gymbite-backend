# Gymbite Backend API 🏋️‍♀️

A comprehensive fitness and nutrition management system built with Node.js, TypeScript, and React. This backend API provides secure user management, workout planning, nutrition tracking, and appointment scheduling for fitness professionals and their clients.

## 🌟 Key Features

### Backend Services

- **🔐 Firebase Admin SDK Integration** - Server-side token verification for secure authentication
- **👥 User Management** - Complete CRUD operations for trainers and clients
- **🏋️ Workout Plans** - Create, manage, and track personalized workout routines
- **🥗 Meal Plans** - Nutrition planning with calorie and macro tracking
- **📅 Appointments** - Scheduling system for trainer-client sessions
- **💬 Consultations** - Chat and video consultation support
- **📊 Progress Tracking** - Weight, measurements, and fitness progress monitoring
- **💌 Notifications** - Push notifications and alerts
- **⭐ Feedback** - Rating and review system

### Dashboard Interface

- **🔐 Admin Authentication** - Secure login for trainers and admins
- **📱 Responsive Design** - Mobile-friendly admin dashboard
- **🎯 Real-time Data** - Live updates and synchronization
- **📈 Analytics** - User engagement and progress insights

### 🔒 Security Features

- **JWT Token Verification** - Firebase ID tokens validated server-side
- **Role-Based Access Control** - CLIENT/TRAINER/ADMIN permissions
- **Protected API Endpoints** - All routes secured with authentication middleware
- **Service Account Integration** - Secure Firebase Admin SDK configuration

## 🎯 Recent Updates

### ✅ Monorepo Architecture (v2.0)

- **🚀 Unified Package Management**: Single `npm install` command installs dependencies for both backend and dashboard
- **📁 Consolidated .gitignore**: One file handles all ignore patterns for the entire project
- **🔄 Workspace Scripts**: Run commands across all projects from the root directory
- **⚡ Optimized Dependencies**: Shared packages automatically hoisted for better performance

### ✅ Dashboard Improvements

- **🎨 Real API Integration**: All fake data eliminated, using live API endpoints
- **🌙 Dark Theme UI**: Consistent styling with loading, error, and empty states
- **📱 Responsive Design**: Mobile-first approach with sidebar navigation
- **🛡️ Type Safety**: Full TypeScript compliance with Prisma schema integration

## ✨ Tech Stack

### Backend

- **Node.js + TypeScript** - Type-safe server development
- **Express.js** - Web framework with middleware support
- **Prisma ORM** - Type-safe database queries with PostgreSQL
- **Firebase Admin SDK** - Server-side authentication and token verification
- **Firebase Authentication** - Secure user authentication
- **Vercel** - Serverless deployment platform

### Frontend (Dashboard)

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type safety for frontend development
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS v4** - Utility-first styling
- **Firebase SDK** - Authentication integration

### Database & Infrastructure

- **PostgreSQL** - Relational database with ACID compliance
- **Prisma Migrations** - Version-controlled schema management
- **Vercel Postgres** - Managed database hosting
- **Environment Variables** - Secure configuration management

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

# 🎯 Single command installs ALL dependencies (backend + dashboard)
npm install

# Generate Prisma client
npx prisma generate
```

> **✨ Monorepo Setup**: This project uses npm workspaces for unified dependency management. Running `npm install` from the root automatically installs packages for both the backend and dashboard!

### 2. Environment Setup

Create `.env` in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/gymbite?schema=public"

# Firebase Admin SDK Configuration (REQUIRED for security)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com"

# Firebase Client Configuration
FIREBASE_API_KEY="your-firebase-api-key"
FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Dashboard Configuration (for Vite)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:3000

# Optional: Testing credentials
FIREBASE_TEST_EMAIL="testadmin@gymbite.com"
FIREBASE_TEST_PASSWORD="your_test_password"
```

### 3. Firebase Setup

1. **Create Firebase Project**:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication with Email/Password

2. **Generate Service Account**:

   - Project Settings → Service Accounts
   - Generate new private key (JSON)
   - Extract credentials for environment variables:

     ```json
     {
       "project_id": "your-firebase-project-id",
       "private_key": "-----BEGIN PRIVATE KEY-----\n...",
       "client_email": "firebase-adminsdk-xxx@..."
     }
     ```

3. **Test Firebase Integration**:

   ```bash
   # Create a test user and get token
   npm run auth-utils create-user testadmin@gymbite.com mypassword
   npm run auth-utils token testadmin@gymbite.com mypassword
   ```

### 4. Database Setup

```bash
# Run database migrations
npx prisma migrate dev

# Optional: Populate with sample data
node populate-data.js
```

### 5. Development Server

```bash
# Start both backend and dashboard
npm run dev

# Or separately:
npm run dev:server    # Backend only (port 3000)
npm run dev:client    # Dashboard only (port 5173)
```

🎉 **Your services are now running:**

- Backend API: `http://localhost:3000`
- Dashboard: `http://localhost:5173`
- Health Check: `http://localhost:3000/api/health`

## 🔐 Authentication System

### Firebase Admin SDK Integration

The backend uses Firebase Admin SDK for secure server-side token verification:

```mermaid
graph LR
    A[Flutter/Web App] --> B[Firebase Auth]
    B --> C[ID Token]
    C --> D[Backend API]
    D --> E[Token Verification]
    E --> F[Prisma Database]
```

### Security Features

- **🔒 Server-side Token Verification**: All tokens validated against Firebase Admin SDK
- **🛡️ Protected Routes**: Authentication middleware on all API endpoints
- **👥 Role-based Access**: CLIENT/TRAINER/ADMIN permission levels
- **🚫 No Client Trust**: UIDs never trusted from client-side requests

### Testing Authentication

Use the built-in testing utilities:

```bash
# Generate Firebase ID token for testing
npm run auth-utils token test@gymbite.com password123

# Output: Bearer token for Postman/API testing
# Example usage in requests:
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users/me
```

### Available Testing Scripts

```bash
# Create test user
npm run auth-utils create-user newuser@test.com password123

# Get Firebase ID token
npm run auth-utils token user@test.com password

# Get user info and token
npm run auth-utils user-info user@test.com password

# Simple token generation
npm run get-token user@test.com password
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
├── 📄 package.json            # Root package & workspace config
├── 📄 tsconfig.json           # TypeScript config
├── 📄 .gitignore              # 🎯 Unified gitignore (backend + dashboard)
├── 📄 vercel.json             # Deployment configuration
├── 📄 populate-data.js        # Sample data script
├── 📄 firebase-auth-utils.js  # Firebase testing utilities
└── 📄 get-firebase-token.js   # Token generation utility
```

## 🛠️ Development Workflow

### 🎯 Monorepo Architecture

This project uses **npm workspaces** for unified dependency and script management:

```json
{
  "workspaces": ["dashboard"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "tsx watch src/index.ts",
    "dev:client": "npm --workspace=dashboard run dev",
    "install:all": "npm install",
    "clean": "npm --workspaces run clean && rm -rf node_modules dist",
    "lint": "npm --workspaces run lint",
    "workspace:dashboard": "npm --workspace=dashboard",
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

### 🎯 Monorepo Package Management

#### **Install Dependencies**

```bash
# Install ALL dependencies (backend + dashboard)
npm install

# Add package to specific workspace
npm install --workspace=dashboard @types/react
npm install express-session  # adds to root/backend

# Add shared dependency to both
npm install lodash
npm install --workspace=dashboard lodash
```

#### **Workspace Commands**

```bash
# Run commands across workspaces
npm run lint                    # Lint all workspaces
npm run clean                   # Clean all build files
npm run build                   # Build backend + dashboard

# Target specific workspace
npm run workspace:dashboard -- run build
npm run workspace:dashboard -- install some-package
```

#### **Benefits of This Setup**

- **🚀 Single Install**: One `npm install` command handles everything
- **📦 Dependency Hoisting**: Shared packages optimized at root level
- **🔄 Unified Scripts**: Run commands for all projects from root
- **⚡ Better Performance**: npm optimizes duplicate dependencies
- **🛠️ Simplified CI/CD**: Single install step in deployment pipelines

### 📁 Consolidated Git Configuration

#### **Unified .gitignore**

The project uses a **single `.gitignore`** at the root level that handles both backend and dashboard:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Environment variables
.env
.env.local
.env.*.local

# Build output
dist/
dist-ssr/
build/
*.local

# IDE and editor files
.vscode/*
!.vscode/extensions.json
.idea/

# OS files
.DS_Store
Thumbs.db

# Deployment
.vercel
```

#### **Benefits of Consolidated .gitignore**

- **🎯 Single Source of Truth**: One file manages all ignore patterns
- **🔄 Simplified Maintenance**: No duplicate or conflicting rules
- **📦 Monorepo Friendly**: Handles multiple project types in one file
- **🚀 Better Performance**: Git processes fewer ignore files

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

#### 🔓 Public Endpoints (No Authentication Required)

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| `GET`  | `/api/health` | Health check    |
| `POST` | `/api/users`  | Create new user |

#### 🔐 Protected Endpoints (Require Authentication)

All endpoints below require `Authorization: Bearer <firebase-id-token>` header.

#### Users

| Method   | Endpoint                           | Description              | Auth Required |
| -------- | ---------------------------------- | ------------------------ | ------------- |
| `GET`    | `/api/users`                       | List all users           | ✅            |
| `GET`    | `/api/users/me`                    | Get current user profile | ✅            |
| `GET`    | `/api/users/:id`                   | Get user by ID           | ✅            |
| `GET`    | `/api/users/firebase/:firebaseUid` | Get user by Firebase UID | ✅            |
| `PUT`    | `/api/users/:id`                   | Update user              | ✅            |
| `DELETE` | `/api/users/:id`                   | Delete user              | ✅            |

#### Trainers

| Method   | Endpoint                     | Description               | Auth Required |
| -------- | ---------------------------- | ------------------------- | ------------- |
| `GET`    | `/api/trainers`              | List all trainers         | ✅            |
| `GET`    | `/api/trainers/:id`          | Get trainer profile       | ✅            |
| `GET`    | `/api/trainers/:id/complete` | Get complete trainer info | ✅            |
| `GET`    | `/api/trainers/:id/clients`  | Get trainer's clients     | ✅            |
| `POST`   | `/api/trainers`              | Create trainer profile    | ✅            |
| `PUT`    | `/api/trainers/:id`          | Update trainer            | ✅            |
| `DELETE` | `/api/trainers/:id`          | Delete trainer            | ✅            |

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

### Firebase Admin SDK Environment Variables

For production deployment, ensure these environment variables are set:

```bash
# Required Firebase Admin SDK variables
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Database and server config
DATABASE_URL=your_production_db_url
NODE_ENV=production
PORT=3000
```

### Option 1: Vercel (Recommended)

#### Backend API

```bash
# Deploy backend to Vercel
npx vercel --prod

# Set environment variables in Vercel dashboard:
DATABASE_URL=your_production_db_url
NODE_ENV=production
CORS_ORIGIN=https://your-dashboard.vercel.app
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
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
# Development
npm run dev              # Start both servers
npm run dev:server       # Backend only (tsx watch)
npm run dev:client       # Dashboard only (vite dev)

# Firebase Testing Utilities
npm run auth-utils token <email> <password>     # Get Firebase ID token
npm run auth-utils create-user <email> <pass>   # Create test user
npm run auth-utils user-info <email> <pass>     # Get user details
npm run get-token <email> <password>            # Simple token generator

# Building
npm run build            # Build both client and server
npm run build:client     # Build dashboard only
npm run build:server     # Build backend only

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma studio
```

### Testing Workflow

1. **Create test user**:

   ```bash
   npm run auth-utils create-user test@gymbite.com password123
   ```

2. **Get authentication token**:

   ```bash
   npm run auth-utils token test@gymbite.com password123
   ```

3. **Test API endpoints**:

   ```bash
   # Copy Bearer token to Postman Authorization header
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users/me
   ```

### Flutter Integration Guide

For mobile app integration, use these patterns:

```dart
// Firebase Auth in Flutter
final idToken = await FirebaseAuth.instance.currentUser?.getIdToken();

// API request with token
final response = await http.get(
  Uri.parse('$baseUrl/api/users/me'),
  headers: {
    'Authorization': 'Bearer $idToken',
    'Content-Type': 'application/json',
  },
);
```

### Project Architecture

```text
🏗️ Monorepo Structure
├── 📁 src/                    # Backend (Node.js + Express + TypeScript)
│   ├── 📁 config/             # Firebase Admin SDK configuration
│   ├── 📁 controllers/        # Route controllers with authentication
│   ├── 📁 middleware/         # Auth middleware for token verification
│   ├── 📁 routes/             # Protected API routes
│   └── 📁 database/           # Prisma client and connection

├── 📁 dashboard/              # Frontend (React + TypeScript + Vite)
│   ├── 📁 src/components/     # UI components and layout
│   ├── 📁 src/context/        # Authentication context
│   ├── 📁 src/pages/          # Dashboard pages
│   └── 📁 src/utils/          # Firebase client configuration

├── 📁 prisma/                 # Database schema and migrations
├── 📄 get-firebase-token.js   # Simple token generation utility
├── 📄 firebase-auth-utils.js  # Advanced authentication testing
└── 📄 populate-data.js        # Sample data population
```

## 📋 Environment Variables Reference

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# Firebase Admin SDK (REQUIRED for authentication)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@project.iam.gserviceaccount.com"

# Firebase Client (for testing utilities)
FIREBASE_API_KEY="your-api-key"
FIREBASE_AUTH_DOMAIN="project.firebaseapp.com"
```

### Optional Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Testing
FIREBASE_TEST_EMAIL="test@example.com"
FIREBASE_TEST_PASSWORD="testpass123"
```

## 🔍 Troubleshooting

### Authentication Issues

#### "Invalid token" or 401 Unauthorized

1. **Check token format**:

   ```bash
   # Token should start with "eyJ"
   npm run auth-utils token test@gymbite.com password123
   ```

2. **Verify Firebase service account**:

   ```bash
   # Check environment variables are set
   echo $FIREBASE_PROJECT_ID
   echo $FIREBASE_CLIENT_EMAIL
   ```

3. **Test with valid user**:

   ```bash
   # Create user first if needed
   npm run auth-utils create-user test@gymbite.com password123
   ```

#### Database Connection Errors

```bash
# Run migrations
npx prisma migrate dev

# Reset database if needed
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate
```

#### Port Already in Use

```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F

# Or use different port
PORT=3001 npm run dev:server
```

#### Proxy Issues in Development

Verify `dashboard/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### Common Error Messages

| Error                         | Solution                                                 |
| ----------------------------- | -------------------------------------------------------- |
| `Table 'User' does not exist` | Run `npx prisma migrate dev`                             |
| `Firebase project not found`  | Check `FIREBASE_PROJECT_ID` in `.env`                    |
| `Invalid private key`         | Ensure `FIREBASE_PRIVATE_KEY` has proper newlines (`\n`) |
| `CORS policy error`           | Set `CORS_ORIGIN` to your frontend URL                   |
| `Port 3000 in use`            | Change `PORT` in `.env` or kill existing process         |

### Build and Deployment

```bash
npm run build            # Build both for production
npm run build:server     # Compile TypeScript
npm run build:client     # Build React app → public/
npm start                # Run production server
```

## 📚 Additional Resources

- **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Express.js Guide**: [expressjs.com](https://expressjs.com)
- **React Documentation**: [react.dev](https://react.dev)
- **Vercel Deployment**: [vercel.com/docs](https://vercel.com/docs)

## 🆘 Support

For questions or issues:

1. Check this README for common solutions
2. Review Firebase Admin SDK documentation
3. Verify environment variables are properly set
4. Test authentication flow with provided utilities
5. Check server logs for detailed error messages

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

**📝 Note**: This README consolidates all Firebase Admin SDK integration details, testing utilities, and comprehensive setup instructions. The implementation includes server-side token verification, protected API endpoints, and complete authentication workflow for secure fitness platform management.

Built with ❤️ using Node.js, React, TypeScript, Tailwind CSS, and PostgreSQL
