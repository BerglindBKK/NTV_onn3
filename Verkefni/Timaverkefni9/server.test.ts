import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { app } from './server';
import { filePathUrl, loadMoviesPaginatedAsync, MovieResponse, saveMoviesAsync } from './movies';

// Fyrirliggjandi gögn fyrir prófanir
const endgameId = '9a809de6-2739-4fee-a627-d9d9db1fbff5';
const fakeMovies: MovieResponse[] = [
  { id: endgameId, title: 'Avengers: End Game', done: false },
  {
    id: 'bc47ea15-9234-481a-8778-374c48eba27e',
    title: 'Avengers: Infinity War',
    done: true,
  },
  {
    id: 'efe45ccf-6996-431d-8d75-535861363bef',
    title: 'The Avengers',
    done: true,
  },
];

// Keyrir á undan hverju einasta prófi til að endurstilla gagnagrunninn
beforeEach(async () => {
  await saveMoviesAsync(filePathUrl, fakeMovies);
});

describe('GET /movies', () => {
  // Próf 1: Sækja allar kvikmyndir
  it('should return 200 OK and a list of all movies when no pagination is used', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(fakeMovies.length);
    expect(response.body.data[0].title).toBe('Avengers: End Game');
  });

  // Próf 2: Sækja tóman lista
  it('should return 200 OK and an empty list if the database is empty', async () => {
    // Yfirskrifum "gagnagrunninn" fyrir þetta eina próf
    await saveMoviesAsync(filePathUrl, []);
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(0);
  });

  // Próf 3: Prófa blaðsíðuskiptingu (fyrsta síða)
  it('should return a paginated result with limit=2 and page=1', async () => {
    const response = await request(app).get('/movies?page=1&limit=2');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].id).toBe(fakeMovies[0].id);
    expect(response.body.data[1].id).toBe(fakeMovies[1].id);
  });

  // Próf 4: Prófa blaðsíðuskiptingu (önnur síða)
  it('should return the second page of a paginated result', async () => {
    const response = await request(app).get('/movies?page=2&limit=2');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1); // Bara ein mynd eftir á síðu 2
    expect(response.body.data[0].id).toBe(fakeMovies[2].id);
  });

  // Próf 5: Prófa ógilt gildi fyrir 'page'
  it('should return 400 Bad Request for invalid query parameters', async () => {
    const response = await request(app).get('/movies?page=abc&limit=xyz');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });
});

describe('GET /movies/:id', () => {
  // Próf 1: Sækja færslu sem er til
  it('should return 200 OK and the correct movie object when ID exists', async () => {
    const response = await request(app).get(`/movies/${endgameId}`);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(endgameId);
    expect(response.body.data.title).toBe('Avengers: End Game');
  });

  // Próf 2: Sækja færslu sem er ekki til
  it('should return 404 Not Found when ID does not exist', async () => {
    const nonExistentId = randomUUID(); // Búum til gilt en óþekkt UUID
    const response = await request(app).get(`/movies/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Movie not found');
  });

  // Próf 3: Sækja færslu með ógildu ID sniði
  it('should return 400 Bad Request for an invalid UUID format', async () => {
    const response = await request(app).get('/movies/123');
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toBe('Invalid UUID format');
  });
});

describe('POST /movies', () => {
  // Próf 1 & 2: Búa til nýja færslu og staðfesta vistun (samþættingarpróf)
  it('should create a new movie, return 201, and persist it to the database', async () => {
    const title = 'Saving Private Ryan';
    const response = await request(app).post('/movies').send({
      movie: title,
    });

    // Staðfesta svarið
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe(title);
    expect(response.body.data.done).toBe(false);

    // Staðfesta vistun með því að lesa beint úr skránni
    const id = response.body.data.id;
    const movies = await loadMoviesPaginatedAsync(filePathUrl, undefined, undefined);
    const movie = movies.find((m) => m.id === id);
    expect(movie).toBeDefined();
    expect(movie?.title).toBe(title);
  });

  // Próf 3 - Tómur titill
  it('should return 400 for an empty title', async () => {
    const response = await request(app).post('/movies').send({ movie: '' });
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toContain('expected string to have >=3');
  });

  // Próf 4 - Of stuttur titill
  it('should return 400 for a title that is too short', async () => {
    const response = await request(app).post('/movies').send({ movie: 'Go' });
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toContain('expected string to have >=3');
  });

  // Próf 5: Senda gögn á röngu sniði
  it('should return 400 for incorrect data type', async () => {
    const response = await request(app).post('/movies').send({ movie: 123 });
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toBe(
      'Invalid input: expected string, received number'
    );
  });

  // Próf 6: Senda tómt object
  it('should return 400 when required fields are missing', async () => {
    const response = await request(app).post('/movies').send({});
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toBe(
      'Invalid input: expected string, received undefined'
    );
  });
});
