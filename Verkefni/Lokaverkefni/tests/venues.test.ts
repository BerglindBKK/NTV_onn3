/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app";

describe("GET /venues", () => {
  it("returns a list of venues", async () => {
    const res = await request(app).get("/api/venues");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const venue = res.body[0];
      expect(venue).toHaveProperty("id");
      expect(venue).toHaveProperty("name");
      expect(venue).toHaveProperty("address");
    }
  });
});

describe("GET /venues/:id", () => {
  it("returns proper HTTP responses for valid and invalid IDs", async () => {
    //given that id = 3 exists <- kannski ekki harðkóða? bæta seinne
    const res = await request(app).get("/api/venues/3");
    expect(res.statusCode).toBe(200);
    //should not crash
    expect(res.statusCode).not.toBe(500);
    //should return 404 if id does not exist
    const notfound = await request(app).get("/api/venues/99999999");
    expect(notfound.statusCode).toBe(404);
    //should return 404 if id is invalid
    const invalid = await request(app).get("/api/venues/g");
    expect(invalid.statusCode).toBe(400);
  });
});
