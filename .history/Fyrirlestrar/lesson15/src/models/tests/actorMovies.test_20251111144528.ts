import db from "../../config/db.js";
import { beforeEach, afterAll, test, expect } from "vitest";
import { createActorMovie, getActorMovies } from "../actorMovies.js";
import { createMovie } from "../movieModel.js";
import { createActor } from "../actorModel.js";

beforeEach(async () => {
  await db.none(
    "TRUNCATE movie_actors, movies, actors, categories RESTART IDENTITY CASCADE;"
  );
  await db.none(
    "INSERT INTO categories (name) VALUES ('Action'), ('Drama'), ('Comedy')"
  );
});

afterAll(async () => {
  await db.$pool.end();
});

test("createActorMovie links an actor and movie", async () => {
  const m = await createMovie({
    name: "Speed",
    category_name: "Action",
    rating: 7.2,
    launch_year: 1994,
  });
  const a = await createActor({
    name: "Keanu Reeves",
    birth_year: 1964,
    nationality: "Canada",
  });

  const movieId = m[0].id;
  const actorRow = await db.one("SELECT id FROM actors WHERE name = $1", [
    "Keanu Reeves",
  ]);

  const res = await createActorMovie({
    movie_id: movieId,
    actor_id: actorRow.id,
  });
  expect(res).toBeDefined();
});

test("getActorMovies returns linked movies", async () => {
  const m = await createMovie({
    name: "The Matrix",
    category_name: "Action",
    rating: 8.7,
    launch_year: 1999,
  });
  const a = await createActor({
    name: "Keanu Reeves",
    birth_year: 1964,
    nationality: "Canada",
  });

  const { id: movieId } = await db.one(
    "SELECT id FROM movies WHERE name = $1",
    ["Speed"]
  ); // or the movie's name in that test

  const actorRow = await db.one("SELECT id FROM actors WHERE name = $1", [
    "Keanu Reeves",
  ]);

  await createActorMovie({ movie_id: movieId, actor_id: actorRow.id });

  const list = await getActorMovies(actorRow.id);
  expect(list).toBeDefined();
});
