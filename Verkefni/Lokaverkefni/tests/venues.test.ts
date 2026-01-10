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
    //given that id = 1 exists <- kannski ekki harðkóða? bæta seinne
    const res = await request(app).get("/api/venues/1");
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

  it("shows upcoming events at the venue", async () => {
    const res = await request(app).get("/api/venues/1");
    expect(res.body.venue).toHaveProperty("id");
    expect(res.body.venue).toHaveProperty("name");
    expect(res.body.venue).toHaveProperty("address");
    expect(res.body.venue).toHaveProperty("city");
    expect(Array.isArray(res.body.UpcomingEvents)).toBe(true);

    if (res.body.UpcomingEvents.length > 0) {
      const t = res.body.UpcomingEvents[0];
      expect(t).toHaveProperty("id");
      expect(t).toHaveProperty("title");
      expect(t).toHaveProperty("event_date");
    }
  });

  it("only shows upcoming events in UpcomingEvents", async () => {
    const res = await request(app).get("/api/venues/1");
    expect(res.statusCode).toBe(200);

    res.body.UpcomingEvents.forEach((e: any) => {
      expect(new Date(e.event_date).getTime()).toBeGreaterThan(Date.now());
    });
  });
});
