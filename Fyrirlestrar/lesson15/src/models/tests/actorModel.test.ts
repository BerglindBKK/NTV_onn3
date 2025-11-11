import db from "../../config/db.js";
import { beforeEach, afterAll, test, expect } from "vitest";
import { createActor, getActor } from "../actorModel.js";

beforeEach(async () => {
  await db.none("TRUNCATE actors RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await db.$pool.end();
});

test("createActor inserts a new actor", async () => {
  const actor = { name: "Tom Hanks", birth_year: 1956, nationality: "USA" };
  const res = await createActor(actor);
  expect(res).toBeDefined();
});

test("getActor retrieves an existing actor", async () => {
  const actor = { name: "Tom Hanks", birth_year: 1956, nationality: "USA" };
  await createActor(actor);
  const got = await getActor(1);
  expect(got).toBeDefined();
});
