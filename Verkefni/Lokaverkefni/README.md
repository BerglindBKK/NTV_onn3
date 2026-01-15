## NTV - Lokaverkefni Önn 3

Berglind Halldórsdóttir

# Project description – Tix API (REST)

A RESTful API for a ticket booking system (similar to Tix.is).  
Users can browse events, venues, and categories, and authenticated users can create and cancel bookings.  
Authentication is handled using JSON Web Tokens (JWT).

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- pg-promise
- Vitest + Supertest
- bcrypt
- jsonwebtoken

## Setup

### 1. Create databases

Create two PostgreSQL databases:

- tix_api (development)
- tix_api_test (testing)

### 2. Create database schema and seed data

Run the following SQL files in your database (for development and/or testing as needed):

- src/sql/schema.sql
- src/sql/seed.sql

Notes:

- `seed.sql` is designed primarily for automated tests.
- Event dates use `NOW() +/- INTERVAL` so test cases remain valid regardless of when they are executed.
- The seed includes edge cases such as past events, low stock events, and events within 24 hours.

### 3. Environment variables

Create a `.env` file for development and a `.env.test` file for testing.

Example `.env.test`:

PGHOST=localhost
PGPORT=5432
PGDATABASE=tix_api_test
PGUSER=your_user
PGPASSWORD=your_password
JWT_SECRET=supersecret

Do NOT commit .env. .env.test is included for testing convenience and contains no sensitive credentials.

### 4. Install dependencies

Run:

npm install

## Running the project

### Development

npm run dev

### Build and start

npm run build
npm start

## Running tests

npm test

### Test database behavior

- Tests always run against the test database defined in `.env.test`
- Vitest is configured to load `.env.test` automatically via `vitest.config.ts`
- Before tests run, the database is reset and seeded automatically using `tests/setup.ts`
- Tests are run one at a time to avoid conflicts in the database

## Authentication

Protected endpoints require the following header:

- Authorization: Bearer <token>

Tokens are obtained via:

- POST /api/auth/login

## API Endpoints

### Authentication

POST /api/auth/signup  
Request body:

{
"name": string,
"email": string,
"password": string
}

Response:

- 201 Created
- Returns user information (password hash is never returned)

POST /api/auth/login  
Request body:

{
"email": string,
"password": string
}

Response:

- 200 OK
- Returns a JWT token

### Events

GET /api/events

Optional query parameters:

- title (string)
- category_id (number)
- venue_id (number)
- city (string, case-insensitive partial match)
- date_from (ISO date string)
- date_to (ISO date string)
- sort = date | price | popularity

Notes:

- Only upcoming events are returned (event_date > NOW()).
- Sorting behavior:
  - date: earliest events first
  - price: lowest minimum ticket price first
  - popularity: based on number of booking items per event

GET /api/events/:id

- Returns event details and available tickets
- 400 for invalid id
- 404 if event is not found

### Categories

GET /api/categories  
GET /api/categories/:id

- 400 for invalid id
- 404 if category is not found

### Venues

GET /api/venues  
GET /api/venues/:id

Response format for single venue:

{
"venue": { ... },
"upcomingEvents": [ ... ]
}

- upcomingEvents includes only future events at the venue
- 400 for invalid id
- 404 if venue is not found

### Bookings (authenticated)

GET /api/bookings/me

- Returns booking history for the authenticated user
- Returns an empty array if no bookings exist

POST /api/bookings  
Request body:

{
"event_id": number,
"ticket_id": number,
"quantity": number
}

Responses:

- 201 Created on success
- 404 if event or ticket is not found
- 409 if event is in the past, ticket does not belong to event, or insufficient stock

DELETE /api/bookings/:id

- Cancels a booking if the event is more than 24 hours away
- Restores ticket stock
- Responses:
  - 200 on success
  - 403 if booking belongs to another user
  - 404 if booking is not found
  - 409 if cancellation is not allowed (<24 hours)

### Users (authenticated)

PATCH /api/users/me

- Updates provided fields only (name, email, password)
- 409 if email is already in use

DELETE /api/users/me

- Cancels all future bookings for the user
- Restores ticket stock
- Deletes the user account

## Business Rules Implemented

- Tickets cannot be overbooked
- Cancelling bookings restores ticket stock
- Tickets cannot be booked for past events
- Bookings can only be cancelled more than 24 hours before the event
- Passwords are securely hashed using bcrypt
- JWT authentication is required for protected endpoints

## Payment and Refund Handling

This project does not integrate with a real payment provider as payment processing was not part of the course material.

Instead, payment and refund handling is simulated through booking logic:

- A successful booking (`POST /api/bookings`) represents a successful payment.
  - All business rules are validated (event exists, event is in the future, sufficient ticket stock).
  - If validation passes, a booking is created and ticket stock is reduced.

- A successful booking cancellation (`DELETE /api/bookings/:id`) represents a successful refund.
  - Cancellation is only allowed more than 24 hours before the event.
  - The booking is removed and ticket stock is restored.

No payment details, transactions, or monetary balances are stored.
