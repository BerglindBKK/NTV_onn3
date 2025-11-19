DROP TABLE IF EXISTS movies CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_year INTEGER,
  rating DECIMAL(3, 1) CHECK (
    rating >= 0
    AND rating <= 10
  ),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
  ),
  comment TEXT,
  movie_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (movie_id) PREFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert some sample data for testing
INSERT INTO
  movies (title, release_year, rating, description)
VALUES
  (
    'The Shawshank Redemption',
    1994,
    9.3,
    'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  ),
  (
    'The Godfather',
    1972,
    9.2,
    'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
  ),
  (
    'The Dark Knight',
    2008,
    9.0,
    'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'
  ),
  (
    'Inception',
    2010,
    8.8,
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'
  ),
  (
    'Pulp Fiction',
    1994,
    8.9,
    'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.'
  );