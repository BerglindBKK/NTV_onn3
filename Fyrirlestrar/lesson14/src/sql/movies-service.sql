CREATE TABLE categories (
  name VARCHAR(100) NOT NULL PRIMARY KEY
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  rating DECIMAL(5,1) CHECK (rating >= 0 AND rating <= 10),
  launch_year INTEGER,
  FOREIGN KEY (category_name) REFERENCES categories(name) ON DELETE CASCADE
);

CREATE TABLE actors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_year INTEGER,
  nationality VARCHAR(100)
);

CREATE TABLE movie_actors (
  movie_id INTEGER NOT NULL,
  actor_id INTEGER NOT NULL,
  PRIMARY KEY (movie_id, actor_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);