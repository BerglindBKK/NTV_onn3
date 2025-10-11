# Movies Watchlist API

This is a simple REST API built with Node.js, Express, and TypeScript to manage a personal watchlist for movies.

## Features

- Full CRUD (Create, Read, Update, Delete) functionality for movies.
- Data is persisted in a `movies.json` file.
- Simple logging middleware for all incoming requests.

## Running the Project

To run the development server (which will automatically restart on file changes):

```bash
npm install
npm run server

```

The server will start and be accessible at http://localhost:3009.

## API Endpoints

**The following is a complete guide to the available API endpoints. You can use a tool like Postman to test them.**

| Method | Path        | Description                                      | Example Request Body                   | Possible Responses            |
| ------ | ----------- | ------------------------------------------------ | -------------------------------------- | ----------------------------- |
| GET    | /movies     | Retrieves a list of all movies.                  | -                                      | 200 OK                        |
| GET    | /movies/:id | Retrieves a single movie by its ID.              | -                                      | 200 OK, 404 Not Found         |
| POST   | /movies     | Creates a new movie.                             | { "title": "Inception", "year": 2010 } | 201 Created, 400 Bad Request  |
| PATCH  | /movies/:id | Updates one or more fields of an existing movie. | { "watched": true }                    | 200 OK, 404 Not Found         |
| DELETE | /movies/:id | Deletes a movie from the watchlist by its ID.    | -                                      | 204 No Content, 404 Not Found |
