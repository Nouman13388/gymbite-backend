# Gymbite Backend

A Node.js backend application for the Gymbite platform, built with Express, TypeScript, and PostgreSQL.

## Features

- User management (CRUD operations)
- Trainer, Client, Consultation, Appointment, Workout Plan, Meal Plan, Feedback, Notification, and Progress management (CRUD operations)
- PostgreSQL database with Prisma ORM
- TypeScript support
- Environment variable configuration
- CORS enabled
- RESTful API design
- Error handling middleware
- Input validation middleware

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gymbite-backend.git
cd gymbite-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/gymbite?schema=public"
PORT=3000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

## Development

Start the development server:
```bash
npm run dev
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Trainers

- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get trainer by ID
- `POST /api/trainers` - Create a new trainer
- `PUT /api/trainers/:id` - Update a trainer
- `DELETE /api/trainers/:id` - Delete a trainer

### Clients

- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create a new client
- `PUT /api/clients/:id` - Update a client
- `DELETE /api/clients/:id` - Delete a client

### Consultations

- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/:id` - Get consultation by ID
- `POST /api/consultations` - Create a new consultation
- `PUT /api/consultations/:id` - Update a consultation
- `DELETE /api/consultations/:id` - Delete a consultation

### Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

### Workout Plans

- `GET /api/workout-plans` - Get all workout plans
- `GET /api/workout-plans/:id` - Get workout plan by ID
- `POST /api/workout-plans` - Create a new workout plan
- `PUT /api/workout-plans/:id` - Update a workout plan
- `DELETE /api/workout-plans/:id` - Delete a workout plan

### Meal Plans

- `GET /api/meal-plans` - Get all meal plans
- `GET /api/meal-plans/:id` - Get meal plan by ID
- `POST /api/meal-plans` - Create a new meal plan
- `PUT /api/meal-plans/:id` - Update a meal plan
- `DELETE /api/meal-plans/:id` - Delete a meal plan

### Feedback

- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Notifications

- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create a new notification
- `PUT /api/notifications/:id` - Update a notification
- `DELETE /api/notifications/:id` - Delete a notification

### Progress

- `GET /api/progress` - Get all progress records
- `GET /api/progress/:id` - Get progress record by ID
- `POST /api/progress` - Create a new progress record
- `PUT /api/progress/:id` - Update a progress record
- `DELETE /api/progress/:id` - Delete a progress record

## Project Structure

```
src/
├── controllers/    # Route controllers
├── routes/         # API routes
├── models/         # Database models
├── middleware/     # Custom middleware
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Deployment

To deploy the application using PM2:
```bash
pm2 start dist/index.js --name "gymbite-backend"
```

## Testing

Use tools like Postman or curl to test the APIs. Comprehensive testing is recommended to ensure all endpoints work as expected.

## Documentation

API documentation is pending. Once generated, it will be available in `API_DOCUMENTATION.md`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.