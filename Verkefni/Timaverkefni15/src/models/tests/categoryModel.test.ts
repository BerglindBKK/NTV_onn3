// tests/userModel.test.js
import db from "../../config/db.js";
import { Category, createCategory } from "../categoryModel.js";
import { beforeEach, afterAll, test, expect } from "vitest";

//TRUNCATE movies = empty the movies table instantly (much faster than DELETE).
//RESTART IDENTITY = reset the auto-id counter, so the next movie will get id = 1 again.
//CASCADE = if other tables depend on movies (e.g., movie_actors), also clear their related rows automatically.
beforeEach(async () => {
  await db.none("TRUNCATE movies RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  //remove all rows from categories (slower than TRUNCATE, but functionally clears the table).
  await db.none("DELETE FROM categories");
  //close the database connection pool so the test runner can exit cleanly.
  await db.$pool.end();
});

//runs a test that checks if we can add a new category into the database
test("createCategory inserts a new category", async () => {
  //creating a fake category object
  const category: Category = {
    name: "Avatar",
  };
  //calling the function
  const categoryResponse = await createCategory(category);
  //we expect categoryResponse that is not undefined
  expect(categoryResponse).toBeDefined();
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
