# Gymbite Backend

A Node.js backend application for the Gymbite platform, built with Express, TypeScript, and PostgreSQL.

## Features

- User management (CRUD operations)
- PostgreSQL database with Prisma ORM
- TypeScript support
- Environment variable configuration
- CORS enabled
- RESTful API design

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

## Project Structure

```
src/
├── controllers/    # Route controllers
├── routes/         # API routes
├── models/         # Database models
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 