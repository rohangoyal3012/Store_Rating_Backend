# Installation and Usage Guide for Store Rating Application Backend

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd store-rating-app/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including Express, Sequelize, PostgreSQL client, JWT, bcrypt, and other packages defined in package.json.

### 3. Configure Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server Configuration
PORT=8080

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400
```

Replace the placeholder values with your actual database credentials and a secure JWT secret key.

### 4. Set Up the Database

First, ensure PostgreSQL is installed and running on your system. Then create a database with the name specified in your `.env` file.

```bash
# Install Sequelize CLI if not already installed
npm install -g sequelize-cli

# Run database migrations to create tables
npm run migrate

# Seed the database with initial data (optional)
npm run seed
```

Alternatively, you can use the combined setup command:

```bash
npm run setup
```

## Usage

### Starting the Server

For development (with auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8080).

### Testing the API

You can test the API using tools like Postman, cURL, or any HTTP client. Here are some example requests:

#### Authentication

1. Register a new user:

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Regular User Test",
    "email": "john.doe@example.com",
    "password": "Password@123",
    "address": "123 Test Street, Test City, Test Country"
  }'
```

2. Login to get an access token:

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Password@123"
  }'
```

Save the returned access token for authenticated requests.

#### Using the API as a Normal User

1. View all stores:

```bash
curl -X GET http://localhost:8080/api/stores
```

2. Submit a rating for a store:

```bash
curl -X POST http://localhost:8080/api/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "storeId": 1,
    "rating": 4
  }'
```

3. Change your password:

```bash
curl -X POST http://localhost:8080/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "currentPassword": "Password@123",
    "newPassword": "NewPassword@123"
  }'
```

#### Using the API as an Admin

Login as admin (from seed data):

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

1. Get all users:

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

2. Create a new store owner:

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "name": "New Store Owner Test Account",
    "email": "newowner@example.com",
    "password": "Owner@123",
    "address": "123 Owner Street, Owner City",
    "role": "store_owner"
  }'
```

3. Create a new store:

```bash
curl -X POST http://localhost:8080/api/stores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "name": "New Test Store",
    "email": "newstore@example.com",
    "address": "123 Store Street, Store City",
    "ownerId": STORE_OWNER_ID
  }'
```

4. View dashboard statistics:

```bash
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

#### Using the API as a Store Owner

1. View store owner dashboard:

```bash
curl -X GET http://localhost:8080/api/store-owner/dashboard \
  -H "Authorization: Bearer STORE_OWNER_ACCESS_TOKEN"
```

## Troubleshooting

- **Database Connection Issues**: Ensure PostgreSQL is running and the credentials in your `.env` file are correct.
- **Migration Errors**: If migrations fail, try running `npm run migrate:undo:all` to reset, then run `npm run migrate` again.
- **Authentication Errors**: Make sure you're including the correct token format in your Authorization header: `Bearer YOUR_TOKEN`.
- **Validation Errors**: Check that your input data meets the validation requirements (e.g., name length, password format).

## Additional Commands

- `npm run migrate:undo` - Undo the most recent migration
- `npm run migrate:undo:all` - Undo all migrations
- `npm test` - Run tests (if implemented)

---

# Store Rating Application Backend Summary

## Overview

This backend application provides a RESTful API for a store rating platform with role-based access control. The system supports three user roles (Admin, Normal User, and Store Owner) with different permissions and functionalities.

## Core Components

### Models

1. **User Model** (`user.model.js`)

   - Stores user information with fields: name, email, password, address, and role
   - Enforces validation rules (name length 20-60 chars, valid email, etc.)
   - Supports three roles: 'admin', 'user', and 'store_owner'

2. **Store Model** (`store.model.js`)

   - Stores information about registered stores: name, email, address, ownerId, and averageRating
   - Links to a store owner (user with 'store_owner' role) via ownerId
   - Tracks the average rating calculated from user submissions

3. **Rating Model** (`rating.model.js`)
   - Manages ratings (1-5) submitted by users for stores
   - Enforces a unique constraint so a user can only rate a store once
   - Links to both users and stores via foreign keys

### Routes

1. **Authentication Routes** (`auth.routes.js`)

   - `/api/auth/signup`: Register new users with validation
   - `/api/auth/signin`: Authenticate users and issue JWT tokens
   - `/api/auth/change-password`: Allow authenticated users to change their password

2. **User Routes** (`user.routes.js`)

   - Admin-only routes:
     - `/api/users`: Get all users with filtering options
     - `/api/users/:id`: Get detailed user information
     - `/api/users`: Create new users (including admins and store owners)
     - `/api/dashboard/stats`: Get system statistics (user count, store count, rating count)
   - General routes:
     - `/api/user/profile`: Get current user's profile information

3. **Store Routes** (`store.routes.js`)

   - Admin-only routes:
     - `/api/stores` (POST): Create new stores and assign owners
   - Public routes:
     - `/api/stores`: Get all stores with filtering and search
     - `/api/stores/:id`: Get detailed store information
   - Store owner routes:
     - `/api/store-owner/dashboard`: Get store statistics and user ratings

4. **Rating Routes** (`rating.routes.js`)
   - Authenticated user routes:
     - `/api/ratings`: Submit or update ratings for stores
   - Public routes:
     - `/api/stores/:storeId/ratings`: Get all ratings for a specific store

### Server Configuration (`server.js`)

- Sets up Express.js with middleware for parsing JSON and URL-encoded data
- Configures CORS to allow frontend access
- Connects to PostgreSQL database using Sequelize
- Registers all route handlers
- Initializes the server on the configured port

### Package Configuration (`package.json`)

- Defines dependencies: Express, Sequelize, PostgreSQL, JWT, bcrypt, etc.
- Provides scripts for:
  - Starting the server (`npm start`)
  - Development with auto-reload (`npm run dev`)
  - Database migrations (`npm run migrate`)
  - Seeding initial data (`npm run seed`)
  - Combined setup (`npm run setup`)

## Key Features

1. **Authentication & Authorization**

   - JWT-based authentication
   - Role-based access control
   - Password hashing with bcrypt
   - Token validation middleware

2. **Data Management**

   - CRUD operations for users, stores, and ratings
   - Relationship management between entities
   - Automatic calculation of store average ratings

3. **Search & Filtering**

   - Filter users by name, email, address, and role
   - Search stores by name and address
   - Sort functionality for listings

4. **Validation**

   - Input validation for all data submissions
   - Custom validation rules for passwords, emails, etc.
   - Error handling with appropriate HTTP status codes

5. **Database Integration**
   - Sequelize ORM for database operations
   - Migration support for database schema management
   - Seeding capability for initial data population

This backend provides a complete API solution for the store rating application, handling all data management, authentication, and business logic while following best practices for security and performance.
