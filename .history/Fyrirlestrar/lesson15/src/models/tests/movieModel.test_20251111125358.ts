// tests/userModel.test.js
import db from "../../config/db.js";
import { Category, createCategory } from "../categoryModel.js";
import { beforeEach, afterAll, test, expect } from "vitest";

beforeEach(async () => {
  await db.none("TRUNCATE movies RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await db.none("DELETE FROM categories");
  await db.$pool.end();
});

test("createCategory inserts a new category", async () => {
  const category: Category = {
    name: "Avatar",
  };
  const categoryResponse = await createCategory(category);
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

// test('createCategory with duplicate category  ', async () => {
//   const category: Category = {
//     name: 'Avatar',
//   };

//   await expect(createCategory(category)).rejects.toThrow(
//     'error: duplicate key value violates unique constraint "categories_pkey"'
//   );
// });
