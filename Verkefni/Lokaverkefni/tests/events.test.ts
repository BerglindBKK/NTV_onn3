/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app";

describe("GET /events", () => {
  it("returns a list of events", async () => {
    const res = await request(app).get("/api/events");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const event = res.body[0];
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("event_date");
    }
  });
});

describe("GET /events/:id", () => {
  it("returns proper HTTP responses for valid and invalid IDs", async () => {
    //given that id = 1 exists <- kannski ekki harðkóða? bæta seinne
    const res = await request(app).get("/api/events/1");
    expect(res.statusCode).toBe(200);
    //should not crash
    expect(res.statusCode).not.toBe(500);
    //should return 404 if id does not exist
    const notfound = await request(app).get("/api/events/99999999");
    expect(notfound.statusCode).toBe(404);
    //should return 404 if id is invalid
    const invalid = await request(app).get("/api/events/g");
    expect(invalid.statusCode).toBe(400);
  });
});
