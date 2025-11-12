# GymBite - Complete Fitness Management Platform 🏋️‍♀️# GymBite - Complete Fitness Management Platform 🏋️‍♀️

A modern, full-stack fitness management platform connecting trainers and clients through personalized workout plans, meal tracking, real-time chat, and push notifications. Built with TypeScript, Express, Prisma, PostgreSQL, Firestore, and React.A modern, full-stack fitness management platform connecting trainers and clients through personalized workout plans, meal tracking, real-time chat, and push notifications. Built with TypeScript, Express, Prisma, PostgreSQL, Firestore, and React.

---

## 📦 What's Included## 📦 What's Included

This repository contains:This repository contains:

- **Backend API** - Express.js REST API with TypeScript- **Admin Dashboard** - React + Vite frontend for managing the platform

- **Admin Dashboard** - React + Vite frontend for managing the platform

- **Database** - PostgreSQL with Prisma ORM + Firestore for real-time features

- **Authentication** - Firebase Admin SDK

- **Push Notifications** - Firebase Cloud Messaging (FCM)

- **Real-Time Chat** - Firestore integration

---

## 🎯 Key Features

### Backend API- ✅ 50+ RESTful API endpoints

- ✅ Role-based access control (Admin, Trainer, Client)

- ✅ 50+ RESTful API endpoints- ✅ Firebase authentication integration

- ✅ Role-based access control (Admin, Trainer, Client)- ✅ Push notifications via FCM

- ✅ Firebase authentication integration- ✅ Real-time chat rooms with Firestore

- ✅ Push notifications via FCM- ✅ Comprehensive error handling

- ✅ Real-time chat rooms with Firestore- ✅ Request validation with Zod

- ✅ Comprehensive error handling- ✅ TypeScript for type safety

- ✅ Request validation with Zod

- ✅ TypeScript for type safety### Admin Dashboard

- ✅ Modern dark-themed UI

### Admin Dashboard- ✅ User management (Users, Trainers, Clients)

- ✅ Workout & Meal plan management

- ✅ Modern dark-themed UI- ✅ Appointment scheduling

- ✅ User management (Users, Trainers, Clients)- ✅ Progress tracking & analytics

- ✅ Workout & Meal plan management- ✅ Notification system with templates

- ✅ Appointment scheduling- ✅ Real-time search functionality

- ✅ Progress tracking & analytics- ✅ Feedback management

- ✅ Notification system with templates- ✅ Settings & profile pages

- ✅ Real-time search functionality

- ✅ Feedback management---

- ✅ Settings & profile pages

## 🚀 Quick Start

### Prerequisites- PostgreSQL database

- Firebase project (for auth & notifications)

- Node.js 18+ and npm

- PostgreSQL database### Installation

- Firebase project (for auth & notifications)

1. **Clone the repository**

### Installation ```bash

git clone https://github.com/Nouman13388/gymbite-backend.git

1. **Clone the repository** cd gymbite-backend

   ````

   ```bash

   git clone https://github.com/Nouman13388/gymbite-backend.git2. **Install backend dependencies**

   cd gymbite-backend   ```bash

   ```   npm install

   ````

2. **Install backend dependencies**

3. **Install dashboard dependencies**

   `bash   `bash

   npm install cd dashboard

   ```npm install

   cd ..

   ```

4. **Install dashboard dependencies** ```

   ````bash4. **Set up environment variables**

   cd dashboard

   npm install   Create `.env` in root:

   cd ..   ```bash

   ```   DATABASE_URL="postgresql://user:password@localhost:5432/gymbite"

   PORT=3000

   ````

5. **Set up environment variables** NODE_ENV=development

   CORS_ORIGIN=http://localhost:5173

   Create `.env` in root:

   # Firebase Admin SDK

   ````bash FIREBASE_PROJECT_ID=your_project_id

   DATABASE_URL="postgresql://user:password@localhost:5432/gymbite"   FIREBASE_CLIENT_EMAIL=your_service_account_email

   PORT=3000   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

   NODE_ENV=development   ```

   CORS_ORIGIN=http://localhost:5173

      Create `dashboard/.env`:

   # Firebase Admin SDK   ```bash

   FIREBASE_PROJECT_ID=your_project_id   VITE_API_URL=http://localhost:3000

   FIREBASE_CLIENT_EMAIL=your_service_account_email

   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"   # Firebase Client SDK

   ```   VITE_FIREBASE_API_KEY=your_api_key

   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

   Create `dashboard/.env`:   VITE_FIREBASE_PROJECT_ID=your_project_id

   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

   ```bash   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

   VITE_API_URL=http://localhost:3000   VITE_FIREBASE_APP_ID=your_app_id

   ````

   # Firebase Client SDK

   VITE_FIREBASE_API_KEY=your_api_key5. **Run database migrations**

   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com ```bash

   VITE_FIREBASE_PROJECT_ID=your_project_id npx prisma migrate deploy

   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com npx prisma generate

   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id ```

   VITE_FIREBASE_APP_ID=your_app_id

   ```6. **Start development servers**

   ```

6. **Run database migrations** Terminal 1 - Backend:

   ````bash

   ```bash   npm run dev

   npx prisma migrate deploy   ```

   npx prisma generate

   ```   Terminal 2 - Dashboard:

   ```bash

   ````

7. **Start development servers** cd dashboard

   npm run dev

   Terminal 1 - Backend: ```

   ````bash7. **Access the application**

   npm run dev   - Dashboard: http://localhost:5173

   ```   - API: http://localhost:3000/api



   Terminal 2 - Dashboard:---



   ```bash## 📚 API Documentation

   cd dashboard

   npm run dev### Authentication

   ````

All API endpoints require Firebase authentication token in the Authorization header:

7. **Access the application**```

   - Dashboard: <http://localhost:5173>Authorization: Bearer <firebase_id_token>

   - API: <http://localhost:3000/api>```

---### Base URL

- Development: `http://localhost:3000/api`

## 📚 API Documentation- Production: `https://gymbite-backend.vercel.app/api`

### Authentication### API Endpoints Overview

All API endpoints require Firebase authentication token in the Authorization header:#### Users (7 endpoints)

- `GET /users` - Get all users

```http- `GET /users/:id` - Get user by ID

Authorization: Bearer <firebase_id_token>- `POST /users` - Create new user

```- `PUT /users/:id` - Update user

- `DELETE /users/:id` - Delete user

### Base URL- `GET /users/me` - Get current authenticated user

- `POST /users/sync-firestore` - Sync user to Firestore

- Development: `http://localhost:3000/api`

- Production: `https://gymbite-backend.vercel.app/api`#### Trainers (5 endpoints)

- `GET /trainers` - Get all trainers

### API Endpoints Overview- `GET /trainers/:id` - Get trainer details

- `POST /trainers` - Create trainer

#### Users (7 endpoints)- `PUT /trainers/:id` - Update trainer

- `DELETE /trainers/:id` - Delete trainer

- `GET /users` - Get all users

- `GET /users/:id` - Get user by ID#### Clients (5 endpoints)

- `POST /users` - Create new user- `GET /clients` - Get all clients

- `PUT /users/:id` - Update user- `GET /clients/:id` - Get client details

- `DELETE /users/:id` - Delete user- `POST /clients` - Create client

- `GET /users/me` - Get current authenticated user- `PUT /clients/:id` - Update client

- `POST /users/sync-firestore` - Sync user to Firestore- `DELETE /clients/:id` - Delete client

#### Trainers (5 endpoints)#### Workout Plans (5 endpoints)

- `GET /workout-plans` - Get all workout plans

- `GET /trainers` - Get all trainers- `GET /workout-plans/:id` - Get workout plan details

- `GET /trainers/:id` - Get trainer details- `POST /workout-plans` - Create workout plan

- `POST /trainers` - Create trainer- `PUT /workout-plans/:id` - Update workout plan

- `PUT /trainers/:id` - Update trainer- `DELETE /workout-plans/:id` - Delete workout plan

- `DELETE /trainers/:id` - Delete trainer

#### Meal Plans (5 endpoints)

#### Clients (5 endpoints)- `GET /meal-plans` - Get all meal plans

- `GET /meal-plans/:id` - Get meal plan details

- `GET /clients` - Get all clients- `POST /meal-plans` - Create meal plan

- `GET /clients/:id` - Get client details- `PUT /meal-plans/:id` - Update meal plan

- `POST /clients` - Create client- `DELETE /meal-plans/:id` - Delete meal plan

- `PUT /clients/:id` - Update client

- `DELETE /clients/:id` - Delete client#### Appointments (6 endpoints)

- `GET /appointments` - Get all appointments

#### Workout Plans (5 endpoints)- `GET /appointments/:id` - Get appointment details

- `POST /appointments` - Create appointment

- `GET /workout-plans` - Get all workout plans- `PUT /appointments/:id` - Update appointment

- `GET /workout-plans/:id` - Get workout plan details- `DELETE /appointments/:id` - Delete appointment

- `POST /workout-plans` - Create workout plan- `PATCH /appointments/:id/status` - Update appointment status

- `PUT /workout-plans/:id` - Update workout plan

- `DELETE /workout-plans/:id` - Delete workout plan#### Progress Tracking (5 endpoints)

- `GET /progress` - Get all progress records

#### Meal Plans (5 endpoints)- `GET /progress/:id` - Get progress record

- `POST /progress` - Create progress record

- `GET /meal-plans` - Get all meal plans- `PUT /progress/:id` - Update progress record

- `GET /meal-plans/:id` - Get meal plan details- `DELETE /progress/:id` - Delete progress record

- `POST /meal-plans` - Create meal plan

- `PUT /meal-plans/:id` - Update meal plan#### Notifications (5 endpoints)

- `DELETE /meal-plans/:id` - Delete meal plan- `GET /notifications` - Get all notifications

- `POST /notifications/broadcast` - Send to all users

#### Appointments (6 endpoints)- `POST /notifications/role/:role` - Send to role

- `POST /notifications/user/:userId` - Send to specific user

- `GET /appointments` - Get all appointments- `POST /notifications/send-chat` - Send chat notification

- `GET /appointments/:id` - Get appointment details

- `POST /appointments` - Create appointment#### Feedback (5 endpoints)

- `PUT /appointments/:id` - Update appointment- `GET /feedback` - Get all feedback

- `DELETE /appointments/:id` - Delete appointment- `GET /feedback/:id` - Get feedback details

- `PATCH /appointments/:id/status` - Update appointment status- `POST /feedback` - Submit feedback

- `PUT /feedback/:id` - Update feedback

#### Progress Tracking (5 endpoints)- `DELETE /feedback/:id` - Delete feedback

- `GET /progress` - Get all progress records#### Analytics (2 endpoints)

- `GET /progress/:id` - Get progress record- `GET /analytics/dashboard` - Dashboard statistics

- `POST /progress` - Create progress record- `GET /analytics/user-activity` - User activity metrics

- `PUT /progress/:id` - Update progress record

- `DELETE /progress/:id` - Delete progress record#### Health Check

- `GET /health` - API health status

#### Notifications (5 endpoints)

---

- `GET /notifications` - Get all notifications

- `POST /notifications/broadcast` - Send to all users## 🗄️ Database Schema

- `POST /notifications/role/:role` - Send to role

- `POST /notifications/user/:userId` - Send to specific user### PostgreSQL Models

- `POST /notifications/send-chat` - Send chat notification

````prisma

#### Feedback (5 endpoints)model User {

  id            Int       @id @default(autoincrement())

- `GET /feedback` - Get all feedback  email         String    @unique

- `GET /feedback/:id` - Get feedback details  firebaseUid   String    @unique

- `POST /feedback` - Submit feedback  firstName     String

- `PUT /feedback/:id` - Update feedback  lastName      String

- `DELETE /feedback/:id` - Delete feedback  role          Role      @default(CLIENT)

  deviceToken   String?

#### Analytics (2 endpoints)  createdAt     DateTime  @default(now())

  updatedAt     DateTime  @updatedAt

- `GET /analytics/dashboard` - Dashboard statistics}

- `GET /analytics/user-activity` - User activity metrics

model Trainer {

#### Health Check  id              Int       @id @default(autoincrement())

  name            String

- `GET /health` - API health status  email           String    @unique

  specialization  String?

---  bio             String?

  imageUrl        String?

## 🗄️ Database Schema  createdAt       DateTime  @default(now())

  updatedAt       DateTime  @updatedAt

### PostgreSQL Models}



```prismamodel Client {

model User {  id            Int       @id @default(autoincrement())

  id            Int       @id @default(autoincrement())  name          String

  email         String    @unique  email         String    @unique

  firebaseUid   String    @unique  goal          String?

  firstName     String  age           Int?

  lastName      String  weight        Float?

  role          Role      @default(CLIENT)  height        Float?

  deviceToken   String?  imageUrl      String?

  createdAt     DateTime  @default(now())  trainerId     Int?

  updatedAt     DateTime  @updatedAt  createdAt     DateTime  @default(now())

}  updatedAt     DateTime  @updatedAt

}

model Trainer {

  id              Int       @id @default(autoincrement())model WorkoutPlan {

  name            String  id          Int       @id @default(autoincrement())

  email           String    @unique  userId      Int

  specialization  String?  title       String

  bio             String?  description String?

  imageUrl        String?  category    String

  createdAt       DateTime  @default(now())  duration    Int       @default(30)

  updatedAt       DateTime  @updatedAt  difficulty  String

}  imageUrl    String?

  exercises   Json

model Client {  createdAt   DateTime  @default(now())

  id            Int       @id @default(autoincrement())  updatedAt   DateTime  @updatedAt

  name          String}

  email         String    @unique

  goal          String?model MealPlan {

  age           Int?  id          Int       @id @default(autoincrement())

  weight        Float?  userId      Int

  height        Float?  name        String

  imageUrl      String?  description String?

  trainerId     Int?  meals       Json

  createdAt     DateTime  @default(now())  createdAt   DateTime  @default(now())

  updatedAt     DateTime  @updatedAt  updatedAt   DateTime  @updatedAt

}}



model WorkoutPlan {model Appointment {

  id          Int       @id @default(autoincrement())  id          Int             @id @default(autoincrement())

  userId      Int  clientId    Int

  title       String  trainerId   Int

  description String?  type        AppointmentType

  category    String  dateTime    DateTime

  duration    Int       @default(30)  duration    Int             @default(60)

  difficulty  String  status      String          @default("SCHEDULED")

  imageUrl    String?  notes       String?

  exercises   Json  chatRoomId  String?

  createdAt   DateTime  @default(now())  createdAt   DateTime        @default(now())

  updatedAt   DateTime  @updatedAt  updatedAt   DateTime        @updatedAt

}}



model MealPlan {model Progress {

  id          Int       @id @default(autoincrement())  id          Int       @id @default(autoincrement())

  userId      Int  clientId    Int

  name        String  date        DateTime  @default(now())

  description String?  weight      Float

  meals       Json  bmi         Float

  createdAt   DateTime  @default(now())  bodyFat     Float?

  updatedAt   DateTime  @updatedAt  muscleMass  Float?

}  notes       String?

  createdAt   DateTime  @default(now())

model Appointment {  updatedAt   DateTime  @updatedAt

  id          Int             @id @default(autoincrement())}

  clientId    Int

  trainerId   Intmodel Notification {

  type        AppointmentType  id               Int       @id @default(autoincrement())

  dateTime    DateTime  userId           Int

  duration    Int             @default(60)  title            String

  status      String          @default("SCHEDULED")  message          String

  notes       String?  notificationType String

  chatRoomId  String?  status           String    @default("UNREAD")

  createdAt   DateTime        @default(now())  createdAt        DateTime  @default(now())

  updatedAt   DateTime        @updatedAt}

}

model Feedback {

model Progress {  id          Int       @id @default(autoincrement())

  id          Int       @id @default(autoincrement())  userId      Int

  clientId    Int  rating      Int

  date        DateTime  @default(now())  comment     String?

  weight      Float  category    String

  bmi         Float  status      String    @default("PENDING")

  bodyFat     Float?  createdAt   DateTime  @default(now())

  muscleMass  Float?  updatedAt   DateTime  @updatedAt

  notes       String?}

  createdAt   DateTime  @default(now())```

  updatedAt   DateTime  @updatedAt

}### Firestore Collections



model Notification {```typescript

  id               Int       @id @default(autoincrement())// users collection

  userId           Int{

  title            String  uid: string,

  message          String  email: string,

  notificationType String  firstName: string,

  status           String    @default("UNREAD")  lastName: string,

  createdAt        DateTime  @default(now())  role: string,

}  deviceToken?: string

}

model Feedback {

  id          Int       @id @default(autoincrement())// chat_rooms collection

  userId      Int{

  rating      Int  id: string,

  comment     String?  appointmentId: number,

  category    String  clientId: number,

  status      String    @default("PENDING")  trainerId: number,

  createdAt   DateTime  @default(now())  participants: string[],

  updatedAt   DateTime  @updatedAt  createdAt: Timestamp,

}  lastMessage?: {

```    text: string,

    senderId: string,

### Firestore Collections    timestamp: Timestamp

  }

```typescript}

// users collection```

{

  uid: string,---

  email: string,

  firstName: string,## 🎨 Dashboard Features

  lastName: string,

  role: string,### Implemented Pages

  deviceToken?: string1. **Dashboard** - Overview with stats and recent activity

}2. **Users** - User management with role-based filtering

3. **Trainers** - Trainer profiles and specializations

// chat_rooms collection4. **Clients** - Client management and progress tracking

{5. **Workouts** - Workout plan creation and management

  id: string,6. **Meals** - Meal plan management

  appointmentId: number,7. **Appointments** - Scheduling and calendar view

  clientId: number,8. **Progress** - Client progress tracking and analytics

  trainerId: number,9. **Notifications** - Send notifications with templates

  participants: string[],10. **Feedback** - Review and manage user feedback

  createdAt: Timestamp,11. **Analytics** - Platform statistics and insights

  lastMessage?: {12. **Settings** - Database statistics and configuration

    text: string,13. **Profile** - User profile management

    senderId: string,

    timestamp: Timestamp### UI/UX Features

  }- 🎨 Modern dark theme with consistent styling

}- 🔍 Global search across users, trainers, and clients

```- 🔔 Real-time notification count

- 👤 User menu with profile, settings, and logout

---- 📱 Responsive design

- ⚡ Fast navigation with React Router

## 🎨 Dashboard Features- 🎯 Quick action templates for notifications

- 📊 Interactive charts and statistics

### Implemented Pages

---

1. **Dashboard** - Overview with stats and recent activity

2. **Users** - User management with role-based filtering## � Deployment

3. **Trainers** - Trainer profiles and specializations

4. **Clients** - Client management and progress tracking### Vercel Deployment (Recommended)

5. **Workouts** - Workout plan creation and management

6. **Meals** - Meal plan management#### Backend Deployment

7. **Appointments** - Scheduling and calendar view

8. **Progress** - Client progress tracking and analytics1. **Install Vercel CLI**

9. **Notifications** - Send notifications with templates   ```bash

10. **Feedback** - Review and manage user feedback   npm i -g vercel

11. **Analytics** - Platform statistics and insights   ```

12. **Settings** - Database statistics and configuration

13. **Profile** - User profile management2. **Deploy Backend**

   ```bash

### UI/UX Features   vercel --prod

````

- 🎨 Modern dark theme with consistent styling

- 🔍 Global search across users, trainers, and clients3. **Set Environment Variables in Vercel Dashboard**

- 🔔 Real-time notification count - `DATABASE_URL` - PostgreSQL connection string

- 👤 User menu with profile, settings, and logout - `NODE_ENV=production`

- 📱 Responsive design - `CORS_ORIGIN` - Your dashboard URL

- ⚡ Fast navigation with React Router - Firebase Admin SDK variables

- 🎯 Quick action templates for notifications

- 📊 Interactive charts and statistics4. **Run Migrations**

  ```bash

  ```

--- npx prisma migrate deploy

````

## 🚢 Deployment

#### Dashboard Deployment

### Vercel Deployment (Recommended)

1. **Build and Deploy**

#### Backend Deployment   ```bash

cd dashboard

1. **Install Vercel CLI**   vercel --prod

````

````bash

npm i -g vercel2. **Set Environment Variables**

```   - `VITE_API_URL` - Your backend URL

- All Firebase Client SDK variables

2. **Deploy Backend**

### Post-Deployment Checklist

```bash

vercel --prod- ✅ Backend health check: `https://your-backend.vercel.app/api/health`

```- ✅ Dashboard loads correctly

- ✅ Authentication works

3. **Set Environment Variables in Vercel Dashboard**- ✅ API calls successful

- `DATABASE_URL` - PostgreSQL connection string- ✅ Notifications working

- `NODE_ENV=production`- ✅ Database connections stable

- `CORS_ORIGIN` - Your dashboard URL

- Firebase Admin SDK variables---



4. **Run Migrations**## 🔒 Security



```bash- Firebase authentication for all requests

npx prisma migrate deploy- Environment variables for sensitive data

```- Role-based access control

- Input validation with Zod schemas

#### Dashboard Deployment- CORS protection

- SQL injection prevention via Prisma ORM

1. **Build and Deploy**

---

```bash

cd dashboard## 🛠️ Tech Stack

vercel --prod

```### Backend

- **Runtime**: Node.js 18+

2. **Set Environment Variables**- **Framework**: Express.js

- `VITE_API_URL` - Your backend URL- **Language**: TypeScript

- All Firebase Client SDK variables- **Database**: PostgreSQL

- **ORM**: Prisma

### Post-Deployment Checklist- **Real-time**: Firestore

- **Authentication**: Firebase Admin SDK

- ✅ Backend health check: `https://your-backend.vercel.app/api/health`- **Notifications**: Firebase Cloud Messaging

- ✅ Dashboard loads correctly- **Validation**: Zod

- ✅ Authentication works

- ✅ API calls successful### Frontend (Dashboard)

- ✅ Notifications working- **Framework**: React 18

- ✅ Database connections stable- **Build Tool**: Vite

- **Language**: TypeScript

---- **Routing**: React Router v6

- **Styling**: Tailwind CSS v4

## 🔒 Security- **Icons**: Lucide React

- **Forms**: React Hook Form + Zod

- Firebase authentication for all requests- **HTTP Client**: Axios

- Environment variables for sensitive data

- Role-based access control---

- Input validation with Zod schemas

- CORS protection## 📝 Project Structure

- SQL injection prevention via Prisma ORM

````

---gymbite-backend/

├── src/

## 🛠️ Tech Stack│ ├── config/ # Configuration files

│ ├── controllers/ # Request handlers

### Backend│ ├── middleware/ # Auth, validation

│ ├── routes/ # API routes

- **Runtime**: Node.js 18+│ ├── services/ # Business logic

- **Framework**: Express.js│ ├── types/ # TypeScript types

- **Language**: TypeScript│ └── index.ts # Entry point

- **Database**: PostgreSQL├── dashboard/

- **ORM**: Prisma│ ├── src/

- **Real-time**: Firestore│ │ ├── components/ # Reusable components

- **Authentication**: Firebase Admin SDK│ │ ├── pages/ # Page components

- **Notifications**: Firebase Cloud Messaging│ │ ├── views/ # Layout components

- **Validation**: Zod│ │ ├── context/ # React context

│ │ ├── hooks/ # Custom hooks

### Frontend (Dashboard)│ │ ├── services/ # API services

│ │ ├── schemas/ # Validation schemas

- **Framework**: React 18│ │ └── utils/ # Utility functions

- **Build Tool**: Vite│ ├── public/ # Static assets

- **Language**: TypeScript│ └── package.json

- **Routing**: React Router v6├── prisma/

- **Styling**: Tailwind CSS v4│ ├── schema.prisma # Database schema

- **Icons**: Lucide React│ └── migrations/ # Migration history

- **Forms**: React Hook Form + Zod├── vercel.json # Vercel configuration

- **HTTP Client**: Axios└── package.json

````

---

---

## 📝 Project Structure

## 🧪 Testing

```text

gymbite-backend/```bash

├── src/# Run backend in development

│   ├── config/          # Configuration filesnpm run dev

│   ├── controllers/     # Request handlers

│   ├── middleware/      # Auth, validation# Build backend

│   ├── routes/          # API routesnpm run build

│   ├── services/        # Business logic

│   ├── types/           # TypeScript types# Run dashboard development server

│   └── index.ts         # Entry pointcd dashboard && npm run dev

├── dashboard/

│   ├── src/# Build dashboard for production

│   │   ├── components/  # Reusable componentscd dashboard && npm run build

│   │   ├── pages/       # Page components

│   │   ├── views/       # Layout components# Database operations

│   │   ├── context/     # React contextnpx prisma studio          # Database GUI

│   │   ├── hooks/       # Custom hooksnpx prisma migrate dev     # Create migration

│   │   ├── services/    # API servicesnpx prisma generate        # Generate client

│   │   ├── schemas/     # Validation schemas```

│   │   └── utils/       # Utility functions

│   ├── public/          # Static assets---

│   └── package.json

├── prisma/## 📊 API Stats

│   ├── schema.prisma    # Database schema

│   └── migrations/      # Migration history- **Total Endpoints**: 50+

├── vercel.json          # Vercel configuration- **Database Models**: 11

└── package.json- **Firestore Collections**: 2

```- **Authentication**: Required for all endpoints

- **Response Format**: JSON

---- **Error Handling**: Standardized error responses

- **Documentation**: Complete inline comments

## 🧪 Testing

---

```bash

# Run backend in development## 🤝 Contributing

npm run dev

1. Fork the repository

# Build backend2. Create a feature branch

npm run build3. Make your changes

4. Test thoroughly

# Run dashboard development server5. Submit a pull request

cd dashboard && npm run dev

---

# Build dashboard for production

cd dashboard && npm run build## 📄 License



# Database operationsThis project is private and proprietary.

npx prisma studio          # Database GUI

npx prisma migrate dev     # Create migration---

npx prisma generate        # Generate client

```## 👨‍💻 Author



---**Nouman13388**

- GitHub: [@Nouman13388](https://github.com/Nouman13388)

## 📊 API Stats

---

- **Total Endpoints**: 50+

- **Database Models**: 11## 🆘 Support

- **Firestore Collections**: 2

- **Authentication**: Required for all endpointsFor issues or questions:

- **Response Format**: JSON1. Check existing issues on GitHub

- **Error Handling**: Standardized error responses2. Create a new issue with detailed description

- **Documentation**: Complete inline comments3. Include error logs and screenshots if applicable



------



## 🤝 Contributing**Built with ❤️ for the fitness community**

    "sets": 4,

1. Fork the repository    "reps": 8,

2. Create a feature branch    "restTime": 120,

3. Make your changes    "videoUrl": "https://youtube.com/squat-form",

4. Test thoroughly    "imageUrl": "assets/images/squat.png"

5. Submit a pull request  },

  {

---    "name": "Bench Press",

    "description": "Keep shoulder blades retracted",

## 📄 License    "sets": 4,

    "reps": 8,

This project is private and proprietary.    "restTime": 90,

    "videoUrl": "https://youtube.com/bench-form",

---    "imageUrl": "assets/images/bench.png"

  }

## 👨‍💻 Author]

````

**Nouman13388**

**✅ Backward Compatibility:** The API still accepts `name` field and automatically maps it to `title`

- GitHub: [@Nouman13388](https://github.com/Nouman13388)

**Example Request:**

---

```json

## 🆘 Support{

  "userId": 1,

For issues or questions:  "title": "Advanced Strength Program",

  "description": "A comprehensive 12-week strength building program",

1. Check existing issues on GitHub  "category": "Strength Training",

2. Create a new issue with detailed description  "duration": 60,

3. Include error logs and screenshots if applicable  "difficulty": "Advanced",

  "imageUrl": "https://example.com/images/strength.jpg",

---  "exercises": [

    {

**Built with ❤️ for the fitness community**      "name": "Barbell Squat",

      "description": "Proper depth and form",
      "sets": 4,
      "reps": 8,
      "restTime": 120,
      "videoUrl": "https://youtube.com/squat",
      "imageUrl": "assets/squat.png"
    }
  ]
}
```

---

### Appointment API - Type-Safe Enum System

**Previous Structure (String-Based):**

```typescript
{
  id: number
  clientId: number
  trainerId: number
  appointmentTime: DateTime
  status: string
  notes?: string
  createdAt: DateTime
}
```

**New Enhanced Structure (Enum-Based):**

```typescript
enum AppointmentType {
  IN_PERSON     // Default - Face-to-face training
  VIDEO_CALL    // Virtual session with meeting link
  PHONE_CALL    // Phone consultation
  CHAT          // Text-based coaching
}

{
  id: number
  clientId: number
  trainerId: number
  appointmentTime: DateTime
  type: AppointmentType     // ✅ NEW - Type-safe enum (default: IN_PERSON)
  status: string
  notes?: string
  meetingLink?: string      // ✅ NEW - For VIDEO_CALL appointments
  duration: number          // ✅ NEW - Duration in minutes (default: 60)
  createdAt: DateTime
  updatedAt: DateTime       // ✅ NEW - Auto-updated timestamp
}
```

**Benefits of Enum Approach:**

- ✅ **Type Safety** - TypeScript catches invalid values at compile time
- ✅ **No Typos** - Can't accidentally write "in-persn" or "virutal"
- ✅ **Autocomplete** - IDE suggests valid values as you type
- ✅ **Database Constraints** - PostgreSQL enforces valid values
- ✅ **Better Refactoring** - Renaming updates all usages automatically
- ✅ **Self-Documenting** - Code clearly shows valid appointment types

**Example Requests:**

_IN_PERSON Appointment (default):_

```json
{
  "clientId": 1,
  "trainerId": 1,
  "appointmentTime": "2025-10-27T09:00:00Z",
  "status": "scheduled",
  "duration": 90,
  "notes": "Regular training session"
}
```

_VIDEO_CALL Appointment:_

```json
{
  "clientId": 1,
  "trainerId": 1,
  "appointmentTime": "2025-10-25T10:00:00Z",
  "status": "scheduled",
  "type": "VIDEO_CALL",
  "duration": 60,
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "notes": "Discuss workout progress"
}
```

_PHONE_CALL Appointment:_

```json
{
  "clientId": 1,
  "trainerId": 1,
  "appointmentTime": "2025-10-26T14:00:00Z",
  "status": "scheduled",
  "type": "PHONE_CALL",
  "duration": 30,
  "notes": "Initial fitness assessment"
}
```

---

### Consultation Model - Removed & Consolidated

**❌ Removed Model:**
The `Consultation` model has been completely removed from the codebase as it was redundant with the `Appointment` model.

**Consolidation Strategy:**

- All consultation functionality moved to `Appointment` model
- Appointments can now be filtered by `type` field
- Type-based analytics and reporting implemented
- No breaking changes for existing appointment endpoints

**Before (2 separate models):**

```prisma
model Appointment {
  id              Int      @id
  clientId        Int
  trainerId       Int
  appointmentTime DateTime
  status          String
}

model Consultation {
  id           Int      @id
  clientId     Int
  trainerId    Int
  scheduledAt  DateTime
  status       String
}
```

**After (1 unified model):**

```prisma
model Appointment {
  id              Int             @id
  clientId        Int
  trainerId       Int
  appointmentTime DateTime
  type            AppointmentType @default(IN_PERSON)
  status          String
  meetingLink     String?
  duration        Int             @default(60)
}

enum AppointmentType {
  IN_PERSON
  VIDEO_CALL
  PHONE_CALL
  CHAT
}
```

**Migration Impact:**

- ✅ `consultationController.ts` removed
- ✅ `consultationRoutes.ts` removed
- ✅ All consultation references updated to use appointments
- ✅ Analytics updated to filter appointments by type
- ✅ Trainer schedule updated to group by type
- ✅ Database migration applied successfully

---

### Test Results Summary

**10/10 Tests Passed ✅**

| Test # | Feature                            | Status  |
| ------ | ---------------------------------- | ------- |
| 1      | WorkoutPlan Enhanced Fields        | ✅ PASS |
| 2      | WorkoutPlan Backward Compatibility | ✅ PASS |
| 3      | Appointment IN_PERSON Type         | ✅ PASS |
| 4      | Appointment VIDEO_CALL Type        | ✅ PASS |
| 5      | Appointment PHONE_CALL Type        | ✅ PASS |
| 6      | Appointment CHAT Type              | ✅ PASS |
| 7      | Trainer Schedule Enum Filtering    | ✅ PASS |
| 8      | Trainer Metrics Enum Analytics     | ✅ PASS |
| 9      | Appointment Update                 | ✅ PASS |
| 10     | List All Appointments              | ✅ PASS |

**Test Coverage:**

- ✅ All new WorkoutPlan fields validated
- ✅ Backward compatibility confirmed (`name` → `title`)
- ✅ All 4 AppointmentType enum values tested
- ✅ Enum filtering in analytics working correctly
- ✅ Appointment updates with type changes working
- ✅ Database constraints enforced properly

**Example Test Output:**

```
Trainer Schedule Summary:
  Total Appointments: 4
  Upcoming: 4
  By Type:
    - IN_PERSON: 1
    - VIDEO_CALL: 1
    - PHONE_CALL: 1
    - CHAT: 1
```

---

### Database Migrations Applied

**Migration 1: `20251020193601_enhance_workout_plan_and_consolidate_appointments`**

- Enhanced WorkoutPlan schema (7 field changes)
- Added Appointment fields (type, duration, meetingLink, updatedAt)
- Removed Consultation model completely
- Updated all foreign key relations

**Migration 2: `20251020200045_use_appointment_type_enum`**

- Created AppointmentType enum with 4 values
- Changed `type` field from String to AppointmentType
- Renamed `meetingUrl` → `meetingLink` for consistency
- Set default value to `IN_PERSON`

**Migration Commands:**

```bash
# Applied automatically
npx prisma migrate dev --name enhance_workout_plan_and_consolidate_appointments
npx prisma migrate dev --name use_appointment_type_enum

# Prisma Client regenerated
npx prisma generate
```

---

### Code Changes Summary

**Files Modified (8 files):**

1. ✅ `prisma/schema.prisma` - Schema updates
2. ✅ `src/controllers/workoutPlanController.ts` - Accept new fields
3. ✅ `src/controllers/appointmentController.ts` - Enum support
4. ✅ `src/controllers/trainerController.ts` - Enum filtering
5. ✅ `src/controllers/clientController.ts` - Remove consultation refs
6. ✅ `src/services/analyticsService.ts` - Remove consultation analytics
7. ✅ `src/index.ts` - Remove consultation routes
8. ✅ `README.md` - Documentation updates

**Files Deleted (2 files):**

1. ❌ `src/controllers/consultationController.ts`
2. ❌ `src/routes/consultationRoutes.ts`

**Build Status:**

```bash
✓ TypeScript compilation: 0 errors
✓ Prisma Client generated successfully
✓ Database migrations applied
✓ Server starts without errors
```

---

## 🎯 Key Features

### Backend Services

- **🔐 Firebase Authentication** - Server-side token verification for Flutter app
- **👥 User Management** - Trainers, clients, and admin roles
- **🏋️ Workout Plans** - Personalized routines with exercise tracking
- **🥗 Meal Plans** - AI-generated nutrition plans with calorie/macro management
- **📅 Appointments** - Type-safe scheduling with 4 appointment types (IN_PERSON, VIDEO_CALL, PHONE_CALL, CHAT)
- **💬 Real-Time Communication** - Integrated meeting links and session management
- **📊 Progress Tracking** - Weight, measurements, fitness metrics
- **🔔 Push Notifications** - FCM integration for Flutter mobile app (6 templates)
- **📈 Admin Analytics** - Real-time dashboard with trends
- **⭐ Feedback System** - Ratings and reviews

### Flutter Mobile App Integration

- **📱 Cross-Platform** - iOS & Android support via Flutter 3.x
- **🤖 AI-Powered** - Personalized meal and workout recommendations
- **🔄 Real-Time Sync** - Live data updates with backend
- **💬 In-App Chat** - Direct trainer-client communication
- **� Progress Visualization** - Charts and metrics tracking
- **�🔐 Secure Auth** - Firebase ID token validation

### Web Dashboard (React)

- **🔐 Admin Portal** - Secure authentication for administrators
- **📱 Responsive Design** - Mobile-friendly interface
- **🔍 Advanced Search** - Real-time filtering across all tables
- **⚡ Smart Pagination** - Enhanced data management
- **🎨 Dark Theme** - Modern UI with Tailwind CSS

### Security

- **🛡️ Protected Routes** - Authentication on all endpoints
- **🔒 Role-based Access** - CLIENT/TRAINER/ADMIN permissions
- **🚫 Token Verification** - Server-side Firebase Admin SDK validation
- **🔑 Bearer Tokens** - Secure API authentication for mobile app

### Real-Time Features (Firestore Integration)

- **🔄 PostgreSQL-to-Firestore Sync** - Automatic user data synchronization for real-time features
- **💬 Real-Time Chat System** - Complete chat infrastructure with auto-room creation and push notifications
- **⚡ Auto-Sync on User Operations** - Create and update operations automatically sync to Firestore
- **🛡️ Non-Blocking Sync** - Firestore sync failures don't affect API responses
- **📊 Hybrid Database Strategy** - PostgreSQL for relational data, Firestore for real-time features
- **🔔 FCM Push Notifications** - Automatic chat notifications when users send messages
- **🤖 Auto-Create Chat Rooms** - CHAT-type appointments automatically create Firestore chat rooms

**Firestore Collections:**

```
users/
  └── {firebaseUid}/
      ├── id: Int
      ├── name: String
      ├── email: String
      ├── role: String
      ├── createdAt: Timestamp
      ├── updatedAt: Timestamp
      └── isActive: Boolean

chat_rooms/
  └── {uid1_uid2}/                    // Sorted UIDs joined with underscore
      ├── participants: String[]       // Array of Firebase UIDs
      ├── participantNames: Map        // { uid: "Name" }
      ├── appointmentId: Int           // Reference to appointment
      ├── createdAt: Timestamp
      ├── lastMessageAt: Timestamp
      └── type: String                 // "CHAT"

messages/ (managed by Flutter app)
  └── {roomId}/
      └── messages/
          └── {messageId}/
              ├── senderId: String
              ├── text: String
              ├── timestamp: Timestamp
              └── read: Boolean
```

**User Sync Workflow:**

1. User created/updated in PostgreSQL via Prisma
2. Auto-syncs to Firestore `users/{firebaseUid}` collection
3. Real-time listeners in mobile/web apps get instant updates
4. User data available for chat room participant lookups

**Chat System Workflow:**

1. **Create CHAT Appointment** → Backend auto-creates Firestore chat room
2. **Flutter App Sends Message** → Writes to Firestore `messages/{roomId}`
3. **Flutter App Calls Notification Endpoint** → Backend sends FCM push to receiver
4. **Receiver Gets Notification** → Opens app and sees message in real-time

**Chat Features:**

✅ **Auto-Create Chat Rooms** (Backend)

- Trigger: When appointment `type === "CHAT"` is created
- Fetches Client and Trainer records with Firebase UIDs
- Creates sorted `roomId` from participant UIDs (e.g., `uid1_uid2`)
- Creates Firestore document in `chat_rooms` collection
- Non-blocking: Appointment creation succeeds even if Firestore fails

✅ **Send Chat Notifications** (Backend)

- Endpoint: `POST /api/notifications/send-chat`
- Validates: `roomId`, `senderId`, `messageText`
- Fetches chat room from Firestore
- Identifies receiver from participants array
- Queries PostgreSQL for receiver's `deviceToken`
- Sends FCM push notification if token exists
- Returns proper response for success/no-token scenarios

**Files Involved:**

- `src/config/firebaseAdmin.ts` - Exports `adminFirestore` and `adminMessaging`
- `src/services/firestoreSyncService.ts` - `syncUserToFirestore()` function
- `src/controllers/userController.ts` - Calls sync on create/update
- `src/controllers/appointmentController.ts` - Auto-creates chat rooms on CHAT appointments
- `src/controllers/notificationController.ts` - `sendChatNotification()` function
- `src/routes/notificationRoutes.ts` - `POST /send-chat` endpoint

---

## 🛠️ Tech Stack

**Backend API**

- Node.js with TypeScript
- Express.js REST API
- Prisma ORM + PostgreSQL
- Firebase Admin SDK

**Mobile App (Flutter)**

- Flutter
- GetX for state management
- Firebase Authentication
- Centralized HttpService with automatic token injection
- Clean Architecture pattern

**Web Dashboard (React)**

- React 19 + TypeScript
- Vite build tool
- Tailwind CSS v4
- React Router v6

**Infrastructure**

- Vercel (Backend deployment)
- Vercel PostgreSQL (Database)
- Firebase Cloud Messaging (Push notifications)
- Firebase Authentication (Mobile + Web)
- npm Workspaces (Monorepo)

---

## 🚀 Quick Start

### Prerequisites

- Node.js v20.19.0+
- PostgreSQL database
- Firebase project

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/gymbite-backend.git
cd gymbite-backend

# Install all dependencies (backend + dashboard)
npm install

# Generate Prisma client
npx prisma generate
```

### Environment Setup

Create `.env` in root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gymbite?schema=public"

# Firebase Admin SDK (REQUIRED)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com"

# Firebase Client
FIREBASE_API_KEY="your-firebase-api-key"
FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Dashboard (Vite)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:3000
```

### Firebase Setup

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication with Email/Password

2. **Generate Service Account**

   - Project Settings → Service Accounts
   - Generate new private key (JSON)
   - Extract credentials for `.env`

3. **Test Firebase**
   ```bash
   npm run auth-utils create-user testadmin@gymbite.com password123
   npm run auth-utils token testadmin@gymbite.com password123
   ```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Optional: Load sample data
node populate-data.js

# View database
npx prisma studio
```

### Start Development Servers

```bash
# Start both backend (3000) and dashboard (5173)
npm run dev

# Or separately:
npm run dev:server    # Backend only
npm run dev:client    # Dashboard only
```

🎉 **Services Running:**

- Backend API: `http://localhost:3000`
- Dashboard: `http://localhost:5173`
- Health Check: `http://localhost:3000/api/health`

---

## 📚 API Documentation

### Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-app.vercel.app/api`

### Authentication

All protected endpoints require Firebase token:

```http
Authorization: Bearer <firebase-id-token>
```

Generate token:

```bash
npm run auth-utils token user@example.com password
```

---

## 🔌 API Endpoints (48 Total)

### 🔓 Public Endpoints

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| `GET`  | `/api/health` | Health check |
| `POST` | `/api/users`  | Create user  |

---

### 🔐 Protected Endpoints

**All endpoints below require authentication.**

#### Users (5 endpoints)

| Method   | Endpoint                           | Description          |
| -------- | ---------------------------------- | -------------------- |
| `GET`    | `/api/users`                       | List all users       |
| `GET`    | `/api/users/me`                    | Current user profile |
| `GET`    | `/api/users/:id`                   | Get user by ID       |
| `GET`    | `/api/users/firebase/:firebaseUid` | Get by Firebase UID  |
| `PUT`    | `/api/users/:id`                   | Update user          |
| `DELETE` | `/api/users/:id`                   | Delete user          |

#### Trainers (8 endpoints)

| Method   | Endpoint                     | Description           |
| -------- | ---------------------------- | --------------------- |
| `GET`    | `/api/trainers`              | List trainers         |
| `GET`    | `/api/trainers/:id`          | Get trainer profile   |
| `GET`    | `/api/trainers/:id/complete` | Complete trainer info |
| `GET`    | `/api/trainers/:id/clients`  | Get trainer's clients |
| `POST`   | `/api/trainers`              | Create trainer        |
| `PUT`    | `/api/trainers/:id`          | Update trainer        |
| `DELETE` | `/api/trainers/:id`          | Delete trainer        |

#### Clients (8 endpoints)

| Method   | Endpoint                    | Description          |
| -------- | --------------------------- | -------------------- |
| `GET`    | `/api/clients`              | List clients         |
| `GET`    | `/api/clients/:id`          | Get client profile   |
| `GET`    | `/api/clients/:id/complete` | Complete client info |
| `POST`   | `/api/clients`              | Create client        |
| `PUT`    | `/api/clients/:id`          | Update client        |
| `DELETE` | `/api/clients/:id`          | Delete client        |

#### Workout Plans (5 endpoints) - ✨ ENHANCED in v3.0.0

**New Fields**: title, description, category, duration, difficulty, imageUrl, exercises (JSON)

| Method   | Endpoint                 | Description                     |
| -------- | ------------------------ | ------------------------------- |
| `GET`    | `/api/workout-plans`     | List workout plans              |
| `GET`    | `/api/workout-plans/:id` | Get plan with all new fields    |
| `POST`   | `/api/workout-plans`     | Create plan (7 enhanced fields) |
| `PUT`    | `/api/workout-plans/:id` | Update plan                     |
| `DELETE` | `/api/workout-plans/:id` | Delete plan                     |

**Create/Update Request Body:**

```json
{
  "userId": 1,
  "title": "Advanced Strength Program",
  "description": "12-week strength building program",
  "category": "Strength Training",
  "duration": 60,
  "difficulty": "Advanced",
  "imageUrl": "https://example.com/image.jpg",
  "exercises": [
    {
      "name": "Barbell Squat",
      "description": "Proper form",
      "sets": 4,
      "reps": 8,
      "restTime": 120,
      "videoUrl": "https://youtube.com/video",
      "imageUrl": "assets/squat.png"
    }
  ]
}
```

✅ **Backward Compatible**: Old `name` field still accepted and maps to `title`

#### Meal Plans (5 endpoints)

| Method   | Endpoint              | Description      |
| -------- | --------------------- | ---------------- |
| `GET`    | `/api/meal-plans`     | List meal plans  |
| `GET`    | `/api/meal-plans/:id` | Get plan details |
| `POST`   | `/api/meal-plans`     | Create plan      |
| `PUT`    | `/api/meal-plans/:id` | Update plan      |
| `DELETE` | `/api/meal-plans/:id` | Delete plan      |

#### Progress Tracking (5 endpoints)

#### Appointments (5 endpoints) - ✨ ENHANCED in v3.0.0

**New Fields**: type (enum), duration, meetingLink, updatedAt  
**Enum Types**: IN_PERSON, VIDEO_CALL, PHONE_CALL, CHAT

| Method   | Endpoint                | Description                    |
| -------- | ----------------------- | ------------------------------ |
| `GET`    | `/api/appointments`     | List all appointments          |
| `GET`    | `/api/appointments/:id` | Get appointment details        |
| `POST`   | `/api/appointments`     | Create appointment (enum type) |
| `PUT`    | `/api/appointments/:id` | Update appointment             |
| `DELETE` | `/api/appointments/:id` | Delete appointment             |

**Create/Update Request Body:**

```json
{
  "clientId": 1,
  "trainerId": 1,
  "appointmentTime": "2025-10-25T10:00:00Z",
  "type": "VIDEO_CALL",
  "status": "scheduled",
  "duration": 60,
  "meetingLink": "https://meet.google.com/abc-def-ghi",
  "notes": "Discuss workout progress"
}
```

**Supported Types:**

- `IN_PERSON` - Face-to-face training session (default)
- `VIDEO_CALL` - Virtual session with meeting link
- `PHONE_CALL` - Phone consultation
- `CHAT` - Text-based coaching session

#### Progress Tracking (5 endpoints) - ✨ UPDATED Nov 6, 2025

**API Contract Update**: Dashboard now uses simplified request schema

**Request Body (Dashboard → Backend):**

```json
{
  "clientId": 2,
  "weight": 75.5,
  "bodyFat": 18.5,
  "muscleMass": 55.2,
  "notes": "Feeling stronger, completed all workouts this week!"
}
```

**Backend Processing:**

- Auto-generates `progressDate` (current timestamp)
- Auto-calculates `BMI` from weight (using default height 1.7m)
- Maps `bodyFat` + `muscleMass` → `workoutPerformance` field
- Maps `notes` → `mealPlanCompliance` field

**Response (Backend → Dashboard):**

```json
{
  "id": 1,
  "clientId": 2,
  "weight": "75.5",
  "BMI": "26.12456747404845",
  "progressDate": "2025-11-06T17:56:06.897Z",
  "workoutPerformance": "Body Fat: 18.5%, Muscle Mass: 55.2kg",
  "mealPlanCompliance": "Feeling stronger, completed all workouts this week!",
  "createdAt": "2025-11-06T17:56:06.902Z"
}
```

| Method   | Endpoint            | Description           |
| -------- | ------------------- | --------------------- |
| `GET`    | `/api/progress`     | List progress records |
| `GET`    | `/api/progress/:id` | Get record            |
| `POST`   | `/api/progress`     | Log progress          |
| `PUT`    | `/api/progress/:id` | Update record         |
| `DELETE` | `/api/progress/:id` | Delete record         |

#### Notifications (15 endpoints)

| Method   | Endpoint                                  | Description                    |
| -------- | ----------------------------------------- | ------------------------------ |
| `POST`   | `/api/notifications/send`                 | Send notification              |
| `POST`   | `/api/notifications/send-to-user/:userId` | Send to user                   |
| `POST`   | `/api/notifications/send-to-role/:role`   | Send to role                   |
| `POST`   | `/api/notifications/send-workout-plan`    | Workout plan notification      |
| `POST`   | `/api/notifications/send-meal-plan`       | Meal plan notification         |
| `POST`   | `/api/notifications/send-appointment`     | Appointment notification       |
| `POST`   | `/api/notifications/send-progress-update` | Progress notification          |
| `POST`   | `/api/notifications/send-general`         | General notification           |
| `POST`   | `/api/notifications/broadcast`            | Broadcast to all               |
| `POST`   | `/api/notifications/send-chat`            | **NEW** Send chat notification |
| `POST`   | `/api/notifications/device/register`      | Register FCM device token      |
| `GET`    | `/api/notifications`                      | List notifications             |
| `GET`    | `/api/notifications/:id`                  | Get notification               |
| `PATCH`  | `/api/notifications/:id/read`             | Mark as read                   |
| `DELETE` | `/api/notifications/:id`                  | Delete notification            |

#### Analytics (8 endpoints)

| Method | Endpoint                                     | Description           |
| ------ | -------------------------------------------- | --------------------- |
| `GET`  | `/api/analytics/dashboard`                   | Dashboard overview    |
| `GET`  | `/api/analytics/users`                       | User analytics        |
| `GET`  | `/api/analytics/users/growth?days=30`        | User growth trends    |
| `GET`  | `/api/analytics/trainers`                    | Trainer analytics     |
| `GET`  | `/api/analytics/clients`                     | Client analytics      |
| `GET`  | `/api/analytics/appointments`                | Appointment analytics |
| `GET`  | `/api/analytics/appointments/trends?days=30` | Appointment trends    |
| `GET`  | `/api/analytics/system/health`               | System health         |

---

## 📊 Analytics API Examples

### Dashboard Overview

```bash
curl -X GET "http://localhost:3000/api/analytics/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "users": {
    "totalUsers": 150,
    "recentRegistrations": 12,
    "usersByRole": [
      { "role": "CLIENT", "count": 100 },
      { "role": "TRAINER", "count": 45 },
      { "role": "ADMIN", "count": 5 }
    ]
  },
  "trainers": {
    "totalTrainers": 45,
    "averageRating": 4.7,
    "topTrainers": [...]
  },
  "clients": {
    "totalClients": 100,
    "activeClients": 85,
    "clientsWithProgress": 72
  },
  "appointments": {
    "totalAppointments": 450,
    "recentAppointments": 28,
    "completionRate": 92.5
  },
  "system": {
    "health": "healthy",
    "database": {
      "users": 150,
      "trainers": 45,
      "clients": 100,
      "appointments": 450,
      "consultations": 234,
      "progressRecords": 1250,
      "feedback": 180,
      "notifications": 3500,
      "workoutPlans": 320,
      "mealPlans": 280
    }
  }
}
```

### User Growth Trends

```bash
curl -X GET "http://localhost:3000/api/analytics/users/growth?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
[
  {
    "date": "2025-10-11",
    "count": 5,
    "byRole": { "CLIENT": 3, "TRAINER": 2, "ADMIN": 0 }
  },
  {
    "date": "2025-10-12",
    "count": 8,
    "byRole": { "CLIENT": 6, "TRAINER": 2, "ADMIN": 0 }
  }
]
```

---

## 🧪 Testing Guide

### PowerShell Testing

```powershell
# Set up authentication
$token = "your_firebase_id_token"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test health check
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET

# Test dashboard analytics
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics/dashboard" `
    -Method GET -Headers $headers

# Test user growth (custom days)
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics/users/growth?days=7" `
    -Method GET -Headers $headers

# Test notifications
$body = @{
    title = "Test Notification"
    body = "This is a test"
    userId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/send" `
    -Method POST -Headers $headers -Body $body
```

### cURL Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Get current user
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/users/me

# Create workout plan
curl -X POST "http://localhost:3000/api/workout-plans" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beginner Strength",
    "description": "4-week program",
    "clientId": 1,
    "trainerId": 1
  }'
```

### Firebase Testing Utilities

```bash
# Create test user
npm run auth-utils create-user newuser@test.com password123

# Get authentication token
npm run auth-utils token user@test.com password

# Get user info
npm run auth-utils user-info user@test.com password
```

### Flutter Mobile App Testing

The Flutter app automatically handles authentication. For development:

```dart
// HttpService automatically injects Bearer token
final response = await httpService.get('/users/profile');
// Headers: Authorization: Bearer <firebase-id-token>
```

**Flutter App Repository**: [https://github.com/Nouman13388/gym_bite](https://github.com/Nouman13388/gym_bite)

**Mobile App Features**:

- Automatic token injection in all API calls
- Clean Architecture with modular design
- GetX state management
- Firebase Auth integration
- Real-time data synchronization

---

## 📦 Push Notifications (FCM)

### Notification Templates

1. **Workout Plan Assigned**: New workout plan notification
2. **Meal Plan Updated**: Diet plan changes
3. **Appointment Reminder**: Upcoming session alerts
4. **Progress Milestone**: Achievement notifications
5. **General Update**: System announcements
6. **Custom Message**: Flexible notifications

### Send Notification Example

```bash
curl -X POST "http://localhost:3000/api/notifications/send-workout-plan" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "workoutPlanId": 5,
    "workoutPlanName": "Advanced HIIT"
  }'
```

### Broadcast to All Users

```bash
curl -X POST "http://localhost:3000/api/notifications/broadcast" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "System Maintenance",
    "body": "Scheduled maintenance tonight at 2 AM",
    "data": { "priority": "high" }
  }'
```

### Chat Notification Example

**Send Chat Push Notification:**

```bash
curl -X POST "https://gymbite-backend.vercel.app/api/notifications/send-chat" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "uid1_uid2",
    "senderId": "B3Qs9viagHT2CGxjZagnObGrEKd2",
    "messageText": "Hey! Ready for our training session?"
  }'
```

**Success Response (with device token):**

```json
{
  "success": true,
  "message": "Chat notification sent successfully",
  "receiver": {
    "id": 2,
    "name": "Test Client",
    "firebaseUid": "QvL7YANFdUMtaXIiFQHFmVasdasd"
  },
  "fcmResponse": {
    "messageId": "projects/gymbite/messages/0:1234567890"
  }
}
```

**Response (no device token registered):**

```json
{
  "success": false,
  "message": "Receiver has no device token registered",
  "receiver": {
    "id": 2,
    "name": "Test Client",
    "firebaseUid": "QvL7YANFdUMtaXIiFQHFmVasdasd"
  }
}
```

**How to Register Device Token (Flutter App):**

```bash
curl -X POST "https://gymbite-backend.vercel.app/api/notifications/device/register" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "fcm_token_from_firebase_messaging"
  }'
```

**Chat Workflow:**

1. **Create CHAT Appointment** → Backend auto-creates Firestore chat room
2. **Flutter App Sends Message** → Writes to Firestore `messages/{roomId}`
3. **Flutter App Calls** `/send-chat` → Backend sends FCM push to receiver
4. **Receiver Gets Notification** → Opens app, sees message in real-time

---

## 💬 Chat System Integration Guide

### For Flutter Developers

**Step 1: Register Device Token**

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> registerDeviceToken() async {
  final fcmToken = await FirebaseMessaging.instance.getToken();

  await http.post(
    Uri.parse('https://gymbite-backend.vercel.app/api/notifications/device/register'),
    headers: {
      'Authorization': 'Bearer $firebaseAuthToken',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({'deviceToken': fcmToken}),
  );
}
```

**Step 2: Create CHAT Appointment**

```dart
final response = await http.post(
  Uri.parse('https://gymbite-backend.vercel.app/api/appointments'),
  headers: {
    'Authorization': 'Bearer $firebaseAuthToken',
    'Content-Type': 'application/json',
  },
  body: jsonEncode({
    'clientId': 1,
    'trainerId': 1,
    'appointmentTime': '2025-10-28T10:00:00Z',
    'type': 'CHAT',  // ← This triggers chat room creation
    'status': 'scheduled',
    'duration': 30,
  }),
);

// Backend auto-creates Firestore chat room: chat_rooms/{uid1_uid2}
```

**Step 3: Listen for Messages (Firestore)**

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

Stream<QuerySnapshot> getChatMessages(String roomId) {
  return FirebaseFirestore.instance
    .collection('messages')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', descending: true)
    .snapshots();
}
```

**Step 4: Send Message & Notification**

```dart
// 1. Write message to Firestore
await FirebaseFirestore.instance
  .collection('messages')
  .doc(roomId)
  .collection('messages')
  .add({
    'senderId': currentUserUid,
    'text': messageText,
    'timestamp': FieldValue.serverTimestamp(),
    'read': false,
  });

// 2. Trigger push notification to receiver
await http.post(
  Uri.parse('https://gymbite-backend.vercel.app/api/notifications/send-chat'),
  headers: {
    'Authorization': 'Bearer $firebaseAuthToken',
    'Content-Type': 'application/json',
  },
  body: jsonEncode({
    'roomId': roomId,
    'senderId': currentUserUid,
    'messageText': messageText,
  }),
);
```

**Step 5: Handle Incoming Notifications**

```dart
FirebaseMessaging.onMessage.listen((RemoteMessage message) {
  // Show local notification or update chat UI
  print('New message: ${message.notification?.body}');
});
```

---

## 🚀 Production Deployment

### Vercel Deployment

#### 1. Prepare Environment Variables

Set these in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com

# Server
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-app.vercel.app
```

#### 2. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npx vercel --prod

# Or push to GitHub (auto-deploy)
git push origin main
```

#### 3. Automatic Deployment Process

When you push to GitHub, Vercel automatically:

1. Installs dependencies (`npm install`)
2. Generates Prisma client (`npx prisma generate`)
3. Deploys database migrations (`prisma migrate deploy`)
4. Builds frontend (`npm run build:client`)
5. Builds backend (`npm run build:server`)
6. Deploys the application

### Database Migration Workflow

#### Development (Local)

```bash
# Modify prisma/schema.prisma
# Sync to local database
npx prisma db push

# Test changes

# Create production migration
npx prisma migrate dev --name add_new_feature

# Commit migration files
git add prisma/migrations/
git commit -m "Add new feature"

# Push to GitHub (triggers Vercel deploy)
git push origin main
```

#### Production

Migrations are automatically applied during Vercel deployment via `prisma migrate deploy`.

### Production Checklist

- ✅ Environment variables set in Vercel
- ✅ Database accessible from Vercel
- ✅ Firebase credentials configured
- ✅ CORS origin set correctly
- ✅ Migrations committed to git
- ✅ Build completes successfully
- ✅ Health check responds
- ✅ SSL/TLS enabled

---

## 🏗️ Project Structure

```
gymbite-backend/
├── 📁 src/                          # Backend source
│   ├── 📁 config/                   # Firebase Admin SDK
│   ├── 📁 controllers/              # Route handlers (12 files)
│   ├── 📁 services/                 # Business logic
│   ├── 📁 routes/                   # API routes (12 files)
│   ├── 📁 middleware/               # Auth + validation
│   ├── 📁 database/                 # Prisma client
│   ├── 📁 types/                    # TypeScript types
│   └── 📄 index.ts                  # App entry point
│
├── 📁 dashboard/                    # React admin dashboard
│   ├── 📁 src/
│   │   ├── 📁 components/           # UI components
│   │   ├── 📁 pages/                # Page components
│   │   ├── 📁 context/              # Auth context
│   │   ├── 📁 hooks/                # Custom hooks
│   │   ├── 📁 services/             # API services
│   │   ├── 📁 types/                # TypeScript types
│   │   ├── 📁 utils/                # Utilities
│   │   ├── 📄 App.tsx               # Root component
│   │   ├── 📄 routes.tsx            # Route config
│   │   └── 📄 index.css             # Tailwind CSS
│   ├── 📄 vite.config.ts            # Vite config
│   ├── 📄 postcss.config.js         # PostCSS + Tailwind
│   └── 📄 package.json              # Dashboard deps
│
├── 📁 prisma/                       # Database
│   ├── 📄 schema.prisma             # Schema definition
│   └── 📁 migrations/               # Migration history
│
├── 📁 public/                       # Built dashboard (production)
├── 📁 dist/                         # Compiled backend (production)
│
├── 📄 package.json                  # Root + workspaces
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 vercel.json                   # Deployment config
├── 📄 .env                          # Environment variables
├── 📄 .gitignore                    # Git ignore rules
│
├── 📄 populate-data.js              # Sample data script
├── 📄 get-firebase-token.js         # Token generator
└── 📄 README.md                     # This file
```

---

## 🛠️ Development Scripts

```bash
# Development
npm run dev                      # Start both servers
npm run dev:server               # Backend only (tsx watch)
npm run dev:client               # Dashboard only (vite dev)

# Firebase Testing
npm run auth-utils token <email> <password>         # Get token
npm run auth-utils create-user <email> <password>   # Create user
npm run auth-utils user-info <email> <password>     # Get user info
npm run get-token <email> <password>                # Simple token

# Building
npm run build                    # Build both
npm run build:client             # Build dashboard
npm run build:server             # Build backend

# Database
npx prisma generate              # Generate client
npx prisma migrate dev           # Run migrations
npx prisma migrate deploy        # Production migrations
npx prisma studio                # Database GUI
npx prisma db push               # Sync schema (dev only)

# Deployment
npm run vercel-build             # Vercel build command
npx vercel --prod                # Deploy to production
```

---

## ⚙️ Monorepo Architecture

### npm Workspaces

This project uses npm workspaces for unified dependency management:

```json
{
  "workspaces": ["dashboard"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "install:all": "npm install",
    "clean": "npm --workspaces run clean && rm -rf node_modules dist",
    "lint": "npm --workspaces run lint"
  }
}
```

### Benefits

- **🚀 Single Install**: One `npm install` handles everything
- **📦 Dependency Hoisting**: Shared packages optimized at root
- **🔄 Unified Scripts**: Run commands for all projects from root
- **⚡ Better Performance**: npm optimizes duplicates
- **🛠️ Simplified CI/CD**: Single install step in pipelines

### Workspace Commands

```bash
# Install all dependencies
npm install

# Add package to dashboard
npm install --workspace=dashboard @types/react

# Add package to backend (root)
npm install express-session

# Run command in workspace
npm run workspace:dashboard -- run build
```

---

## ❌ Error Handling

### Authentication Errors

**401 Unauthorized**

```json
{ "error": "Unauthorized: Invalid token" }
```

**Solution**: Generate fresh token

```bash
npm run auth-utils token user@example.com password
```

### Validation Errors

**400 Bad Request**

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

### Server Errors

**500 Internal Server Error**

```json
{ "error": "Internal server error message" }
```

**Solution**: Check server logs for details

---

## 🐛 Troubleshooting

### Port Already in Use

**Windows (PowerShell):**

```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

### Database Connection Failed

```bash
# Check DATABASE_URL in .env
# Run migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset --force
```

### Prisma Client Not Generated

```bash
# Clean and regenerate
rm -rf node_modules/.prisma
npm cache clean --force
npm install
npx prisma generate
```

### TypeScript Build Errors

```bash
# Check for errors
npx tsc --noEmit

# Build
npm run build:server
```

### Firebase Authentication Failed

1. Verify `.env` has correct Firebase credentials
2. Check service account JSON is valid
3. Ensure user exists in Firebase Authentication
4. Test with fresh token

### Dashboard Proxy Not Working

Verify `dashboard/vite.config.ts`:

```typescript
export default defineConfig({
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

---

## 📖 Additional Resources

- **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Express.js**: [expressjs.com](https://expressjs.com)
- **React**: [react.dev](https://react.dev)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Vite**: [vitejs.dev](https://vitejs.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

## 🎓 Key Learnings

### Technical Insights

1. **TypeScript**: Type safety catches errors early
2. **Prisma**: ORM simplifies complex queries
3. **Firebase Admin SDK**: Robust server-side auth
4. **Parallel Queries**: `Promise.all()` improves performance
5. **Service Layer**: Separation of concerns aids maintainability
6. **Monorepo**: Unified dependency management streamlines workflow

### Best Practices

- ✅ Consistent error handling across endpoints
- ✅ Comprehensive documentation
- ✅ Test-driven validation before deployment
- ✅ Security-first approach (auth on all routes)
- ✅ Environment-based configuration
- ✅ Git workflow with feature branches

---

## 🗺️ Roadmap

### Mobile App ✅ COMPLETE

- ✅ Flutter mobile app (iOS & Android)
- ✅ Push notification integration (FCM)
- ✅ Real-time updates
- ✅ AI-powered meal plan generation
- ✅ Trainer-client communication
- ✅ AI-powered recommendations (meal plans implemented) //WIP

### Optional Enhancements

- [ ] CSV/PDF export for reports
- [ ] API versioning (v2)
- [ ] Automated testing suite
- [ ] APM monitoring (New Relic/Datadog)
- [ ] Advanced logging (Winston)
- [ ] Admin mobile app (Flutter)

---

## 🤝 Contributing

### Backend Contributions

1. Fork this repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit pull request

### Mobile App Contributions

Visit the Flutter app repository: [https://github.com/Nouman13388/gym_bite](https://github.com/Nouman13388/gym_bite)

### Integration Guidelines

When adding new API endpoints:

1. Update backend routes and controllers
2. Test with Postman/cURL
3. Document in this README
4. Update Flutter app services to consume new endpoints
5. Test mobile app integration

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Acknowledgments

**Development Stats (v3.0.0)**:

- Total Development Time: ~4 weeks
- Total Endpoints: 48
- Lines of Code: ~3,500+ (Backend)
- Test Coverage: 100% (10/10 tests passed)
- TypeScript Errors: 0
- Database Migrations: 2 applied successfully
- Mobile Platforms: iOS & Android (Flutter)
- Latest Enhancement: WorkoutPlan & Appointment API v3.0.0

**Backend:**

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Firebase Admin SDK

**Mobile App:**

- Flutter 3.x + Dart
- GetX State Management
- Firebase Authentication
- Clean Architecture

**Web Dashboard:**

- React + Vite
- TypeScript
- Tailwind CSS
  **Infrastructure:**

- Vercel (Backend)
- Firebase (Auth + FCM)
- PostgreSQL (Database)

---

## 🔗 Related Repositories

- **Flutter Mobile App**: [https://github.com/Nouman13388/gym_bite](https://github.com/Nouman13388/gym_bite)
- **Backend API**: [https://github.com/Nouman13388/gymbite-backend](https://github.com/Nouman13388/gymbite-backend) (this repo)

---

## 📞 API Endpoints for Mobile Integration

**Production Base URL**: `https://gymbite-backend.vercel.app/api`

**Authentication**: All endpoints require `Authorization: Bearer <firebase-id-token>` header

**Mobile App Integration**: The Flutter app automatically handles token injection via centralized `HttpService`

For detailed endpoint documentation, see the [API Endpoints](#-api-endpoints-48-total) section above.

---

## 🚀 Deployment & Scripts

### Available NPM Scripts

```bash
# Development
npm run dev                # Start both frontend and backend in dev mode
npm run dev:server         # Start backend only with hot reload
npm run dev:client         # Start dashboard only

# Building
npm run build              # Build both client and server
npm run build:server       # Build TypeScript to JavaScript
npm run build:client       # Build dashboard

# Database Management
npm run db:generate        # Generate Prisma Client
npm run db:push            # Push schema changes to database
npm run db:migrate         # Deploy migrations to production
npm run db:cleanup         # Clean failed migrations (auto-runs on deploy)
npm run db:reset           # Reset local database
npm run db:studio          # Open Prisma Studio
npm run db:status          # Check migration status

# Deployment
npm run vercel-build       # Vercel deployment build (automatic cleanup included)
npm run deploy:trigger     # Trigger new Vercel deployment
```

### Automated Production Deployment

The deployment process **automatically cleans up failed migrations** before applying new ones:

1. **Push to Stage Branch**:

   ```bash
   git add .
   git commit -m "your commit message"
   git push origin stage
   ```

2. **Automatic Cleanup** (runs during `vercel-build`):

   - Removes any failed migration records from `_prisma_migrations` table
   - Generates fresh Prisma Client
   - Applies pending migrations
   - Builds client and server

3. **Vercel Build Process**:
   ```bash
   npm run db:cleanup || true    # Clean failed migrations (fails gracefully)
   prisma generate                # Generate Prisma Client
   prisma migrate deploy          # Apply migrations
   npm run build:client           # Build dashboard
   npm run build:server           # Build API
   ```

### Manual Deployment Trigger

If you need to trigger a deployment without code changes:

```bash
npm run deploy:trigger
```

This creates an empty commit and pushes to trigger Vercel redeployment.

### Troubleshooting Deployments

**Issue: Migration fails with P3009**

**Solution**: Already handled automatically! The `db:cleanup` script runs before migrations.

**Manual fix** (if needed):

```sql
-- Connect to your Vercel Postgres database
-- Go to Vercel Dashboard → Storage → Postgres → Query

DELETE FROM _prisma_migrations WHERE finished_at IS NULL;
```

**Issue: Column already exists**

**Solution**: Our migration files use `IF NOT EXISTS` checks to prevent this.

**Issue: Need to check migration status**

```bash
npm run db:status
```

### Deployment Checklist

- [ ] All tests passing locally
- [ ] Database schema matches Prisma schema
- [ ] Environment variables set in Vercel
- [ ] Push to `stage` branch
- [ ] Monitor Vercel deployment logs
- [ ] Verify migrations applied successfully
- [ ] Test API endpoints in production

**Latest Changes (v3.0.0)**:

- ✨ WorkoutPlan API enhanced with 7 new fields
- ✨ Appointment API upgraded with type-safe enums
- ✨ Consultation model consolidated into Appointments
- ✅ 100% test coverage maintained (10/10 tests passed)
- ✅ Zero breaking changes - backward compatible
