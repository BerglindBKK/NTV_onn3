// tests/userModel.test.js
import db from "../../config/db.js";
import { Category, createCategory } from "../categoryModel.js";
import {
  beforeEach,
  afterAll,
  test,
  expect,
  beforeAll,
  it,
  suite,
} from "vitest";
import { createMovie, Movie } from "../movieModel.js";

beforeAll(async () => {
  const categories: Category[] = [
    { name: "Comedy" },
    { name: "Action" },
    { name: "Drama" },
    { name: "Adventure" },
    { name: "Western" },
  ];
  for (const category of categories) {
    await db.none("INSERT INTO categories (name) VALUES ($1)", [category.name]);
  }
});

beforeEach(async () => {
  await db.none("TRUNCATE movies RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await db.none("DELETE FROM movies CASCADE");
  await db.$pool.end();
});

suite("createMovie", async () => {
  it("should be able to insert a movie", async () => {
    const movie: Movie = {
      name: "The Dark Knight",
      category_name: "Action",
      rating: 9.0,
      launch_year: 2008,
    };
    const movieResponse = await createMovie(movie);
    expect(movieResponse).toBeDefined();
  });

  it("should be able to block an invalid category", async () => {
    const invalidCategory: Movie = {
      name: "The Dark Knight",
      category_name: "Invalid",
      rating: 9.0,
      launch_year: 2008,
    };
    await expect(createMovie(invalidCategory)).rejects.toThrow("error");
  });

  it("should be able to block an invalid rating", async () => {
    const invalidRating: Movie = {
      name: "The Dark Knight",
      category_name: "Action",
      rating: 11.0,
      launch_year: 2008,
    };
    await expect(createMovie(invalidRating)).rejects.toThrow("error");
  });

  it("should be able to block an insert with an invalid launch_year", async () => {
    const movie: Movie = {
      name: "The Dark Knight",
      category_name: "Comedy",
      rating: 11.0,
      launch_year: 2008,
    };
    await expect(createMovie(movie)).rejects.toThrow("error");
  });
});

test("createCategory with empty string", async () => {
  const categoryEmptyString: Category = {
    name: "",
  };

  await expect(createCategory(categoryEmptyString)).rejects.toThrow(
    'error: new row for relation "categories" violates check constraint "categories_name_check"'
  );
});

test("createCategory with duplicate category  ", async () => {
  const category: Category = {
    name: "Avatar",
  };

  await expect(createCategory(category)).rejects.toThrow(
    'error: duplicate key value violates unique constraint "categories_pkey"'
  );
});
