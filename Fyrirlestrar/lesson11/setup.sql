-- ============================================
-- PostgreSQL Workshop - Database Schema Setup
-- ============================================
-- This script creates a movie database with full relational structure
-- Run this first to set up all tables

-- Drop existing tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS movie_actors CASCADE;
DROP TABLE IF EXISTS movie_directors CASCADE;
DROP TABLE IF EXISTS movie_genres CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS actors CASCADE;
DROP TABLE IF EXISTS directors CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

-- ============================================
-- Core Tables
-- ============================================

-- Directors table
CREATE TABLE directors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_year INTEGER CHECK (birth_year >= 1800 AND birth_year <= 2020),
  nationality VARCHAR(100)
);

-- Actors table
CREATE TABLE actors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_year INTEGER CHECK (birth_year >= 1800 AND birth_year <= 2020),
  nationality VARCHAR(100)
);

-- Genres table (normalized lookup table)
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Movies table (main table)
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_year INTEGER NOT NULL CHECK (release_year >= 1888 AND release_year <= 2030),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  box_office_millions DECIMAL(10, 2) CHECK (box_office_millions >= 0),
  rating DECIMAL(3, 1) CHECK (rating >= 0 AND rating <= 10),
  description TEXT,
  watched BOOLEAN DEFAULT FALSE,
  watched_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Junction Tables (Many-to-Many Relationships)
-- ============================================

-- Movie-Director relationship (many-to-many, allows co-directors)
CREATE TABLE movie_directors (
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  director_id INTEGER NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'director', -- 'director', 'co-director'
  PRIMARY KEY (movie_id, director_id)
);

-- Movie-Actor relationship (many-to-many)
CREATE TABLE movie_actors (
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  actor_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  character_name VARCHAR(255),
  billing_order INTEGER CHECK (billing_order > 0), -- 1 = top billing, 2 = second, etc.
  PRIMARY KEY (movie_id, actor_id)
);

-- Movie-Genre relationship (many-to-many)
CREATE TABLE movie_genres (
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

-- ============================================
-- One-to-Many Relationship
-- ============================================

-- Reviews table (one movie can have many reviews)
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0)
);

-- ============================================
-- Verification
-- ============================================

-- Show all created tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Success message
SELECT 'Database schema created successfully!' AS status;
