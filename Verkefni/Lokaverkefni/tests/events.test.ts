/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app.js";

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

  it("returns a filtered list of events", async () => {
    const res = await request(app).get("/api/events?venue_id=1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach((event: any) => {
      expect(event.venue_id).toBe(1);
    });
  });

  it("returns sorted events ascending", async () => {
    const res = await request(app).get("/api/events?sort=price");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (let i = 1; i < res.body.length; i++) {
      expect(Number(res.body[i].min_price)).toBeGreaterThanOrEqual(
        Number(res.body[i - 1].min_price)
      );
    }
  });

  it("sorts by popularity", async () => {
    const res = await request(app).get("/api/events?sort=popularity");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (let i = 1; i < res.body.length; i++) {
      expect(Number(res.body[i - 1].popularity)).toBeGreaterThanOrEqual(
        Number(res.body[i].popularity)
      );
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

  it("shows tickets with price and stock", async () => {
    const res = await request(app).get("/api/events/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("tickets");
    expect(Array.isArray(res.body.tickets)).toBe(true);

    if (res.body.tickets.length > 0) {
      const t = res.body.tickets[0];
      expect(t).toHaveProperty("id");
      expect(t).toHaveProperty("price");
      expect(t).toHaveProperty("stock");
    }
  });
});
