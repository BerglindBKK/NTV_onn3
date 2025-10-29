UPDATE movies
SET watched = TRUE, watched_date = CURRENT_DATE
WHERE title = 'Dunkirk'

UPDATE movies
SET watched = TRUE
WHERE release_year = 2023;

UPDATE movies
SET rating = rating + 0.1
where title = 'Barbie';

select rating from movies
where title = 'Barbie'


SELECT COUNT(*) as movie_count from movies;

SELECT title, rating
FROM movies
WHERE rating > 8.5
ORDER BY rating ASC;

SELECT title, release_year
FROM movies
WHERE release_year BETWEEN 2010 AND 2019
ORDER BY release_year ASC;

SELECT title, release_year
FROM movies
WHERE release_year IN (1994, 2008, 2019)

SELECT title from movies
WHERE title LIKE '%Avengers%';

SELECT title, watched_date
FROM movies
WHERE watched_date IS NOT NULL;

SELECT title, release_year, rating
FROM movies
WHERE release_year >= 2010
ORDER BY release_year DESC
LIMIT 3 OFFSET 6;

-- Aggregate functions
-- COUNT, MAX, MIN, AVG, ROUND,
SELECT AVG(rating) AS average_rating FROM movies;

select max(rating) as highest_rating, MIN(rating) as lowest_rating from movies;

SELECT COUNT(DISTINCT(release_year)) from movies;

SELECT
	release_year,
	COUNT(*) AS movie_count
FROM movies
GROUP BY release_year
ORDER BY movie_count DESC;

SELECT
	release_year,
	COUNT(*) AS blockbuster_count,
	SUM(box_office_millions) as total_earnings
FROM movies
WHERE box_office_millions > 800
GROUP BY release_year
ORDER BY total_earnings DESC;


SELECT
	release_year,
	COUNT(*) as movie_count
FROM movies
GROUP BY release_year
HAVING COUNT(*) > 1;

SELECT
	release_year,
	SUM(box_office_millions) AS total_box_office,
	COUNT(*) AS movie_count
FROM movies
GROUP BY release_year
HAVING SUM(box_office_millions) > 2000;

SELECT
	FLOOR(release_year / 10) * 10 AS decade,
	ROUND(AVG(rating), 2) as average_rating,
	COUNT(*) AS movie_count
FROM movies
GROUP BY decade
HAVING AVG(rating) > 8.0
ORDER BY average_rating DESC;

SELECT
	release_year,
	AVG(rating) AS average_rating,
	COUNT(*) AS movie_count
FROM movies
WHERE release_year > 2000
GROUP BY release_year
HAVING AVG(rating) > 7.5;
