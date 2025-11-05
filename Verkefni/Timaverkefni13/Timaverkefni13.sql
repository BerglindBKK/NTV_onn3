

-- ============================================
-- SECTION 8: ORDER BY & LIMIT
-- ============================================

-- Exercise 8.1: Sort by box office
-- Get all movies sorted by box office earnings (highest first)
-- Show: title, box_office_millions
select title, box_office_millions from movies
where rating >= 8.0
ORDER BY box_office_millions DESC

-- Exercise 8.2: Oldest movies first
-- Get all movies sorted by release year (oldest first)
-- Show: title, release_year
SELECT title, release_year from movies
ORDER BY release_year ASC


-- Exercise 8.3: Multi-column sort
-- Sort movies by release year (newest first), then by rating (highest first)
-- Show: title, release_year, rating
SELECT title, release_year, rating FROM movies
ORDER BY release_year DESC, rating DESC


-- Exercise 8.4: Top 5 rated movies
-- Get the 5 highest-rated movies
-- Show: title, rating
SELECT title, rating FROM movies
ORDER BY rating DESC
LIMIT 5


-- Exercise 8.5: Top 10 earners
-- Get the 10 highest-grossing movies
-- Show: title, box_office_millions
SELECT title, box_office_millions FROM movies
ORDER BY box_office_millions DESC
LIMIT 10

-- Exercise 8.6: Pagination - Page 1
-- Get the first 5 movies sorted by title alphabetically
-- Show: title
SELECT title FROM movies
ORDER BY title ASC
LIMIT 5


-- Exercise 8.7: Pagination - Page 3
-- Get movies 11-15 when sorted by title alphabetically (page 3, 5 per page)
-- Show: title
-- Hint: Use LIMIT 5 OFFSET 10
SELECT title FROM movies
ORDER BY title ASC
LIMIT 5 OFFSET 10


-- Exercise 8.8: Recently watched
-- Get the 5 most recently watched movies
-- Show: title, watched_date
-- Hint: Filter for watched_date IS NOT NULL first
SELECT title, watched_date
FROM movies
WHERE watched_date IS NOT NULL
ORDER BY watched_date DESC
LIMIT 5;
