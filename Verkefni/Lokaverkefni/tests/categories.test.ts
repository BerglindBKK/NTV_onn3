/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app";

describe("GET /categories", () => {
  it("returns a list of events", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const category = res.body[0];
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
    }
  });
});

describe("GET /categories/:id", () => {
  it("returns proper HTTP responses for valid and invalid IDs", async () => {
    //given that id = 3 exists
    const res = await request(app).get("/api/categories/3");
    expect(res.statusCode).toBe(200);
    //should not crash
    expect(res.statusCode).not.toBe(500);
    //should return 404 if id does not exist
    const notfound = await request(app).get("/api/categories/99999999");
    expect(notfound.statusCode).toBe(404);
    //should return 404 if id is invalid
    const invalid = await request(app).get("/api/categories/g");
    expect(invalid.statusCode).toBe(400);
  });
});
