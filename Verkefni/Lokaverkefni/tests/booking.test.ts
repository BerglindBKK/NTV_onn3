/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app";
import db from "../src/config/db.js";

describe("GET /bookings", () => {
  let token: string;
  //uses same signup, login and token for all GET tests
  beforeAll(async () => {
    //sign up for all GET
    await request(app).post("/api/auth/signup").send({
      name: "getbookingstester",
      email: "getbookingstester@test.com",
      password: "getbookingspassword",
    });
    //login for all GET
    const res = await request(app).post("/api/auth/login").send({
      email: "getbookingstester@test.com",
      password: "getbookingspassword",
    });

    // get token for all GET
    token = res.body.token;
  });

  // Happy path
  it("returns 200 and array", async () => {
    // call bookings with a token
    const res = await request(app)
      .get("/api/bookings/me")
      .set("Authorization", `Bearer ${token}`);

    //expecting results
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns correct booking response", async () => {
    // call bookings with a token
    const res = await request(app)
      .get("/api/bookings/me")
      .set("Authorization", `Bearer ${token}`);

    //check if response matches expectations
    if (res.body.length > 0) {
      const booking = res.body[0];
      expect(booking).toHaveProperty("id");
      expect(booking).toHaveProperty("user_id");
      expect(booking).toHaveProperty("event_id");
    }
  });

  // errors
  it("fails without a token", async () => {
    // call bookings without a token
    const res = await request(app).get("/api/bookings/me");
    //expecting results
    expect(res.status).toBe(401);
  });

  it("should not crash", async () => {
    // call bookings without a token
    const res = await request(app).get("/api/bookings/me");
    expect(res.statusCode).not.toBe(500);
  });
});

describe("POST /bookings", () => {
  let token: string;
  //uses same signup, login and token for all POST tests
  beforeAll(async () => {
    //sign up for all GET
    await request(app).post("/api/auth/signup").send({
      name: "postbookingstester",
      email: "postbookingstester@test.com",
      password: "postbookingspassword",
    });

    //login for all GET
    const res = await request(app).post("/api/auth/login").send({
      email: "postbookingstester@test.com",
      password: "postbookingspassword",
    });
    token = res.body.token;
  });

  // Happy path
  it("creates booking for a signed in user and working token and returns 201", async () => {
    // create booking with a token
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });

    expect(res.status).toBe(201);
  });

  it("reduces amount of availabe tickets after booking", async () => {
    // check original stock
    const before = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);
    // create the booking
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 2 });

    //check stock after booking
    const after = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);
    //expecting the stock to be reduced by the number of quantity
    expect(after.stock).toBe(before.stock - 2);
  });

  it("shows correct response for booking_items", async () => {
    // create the booking
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 2 });

    //check if response matches expectations
    if (res.body.length > 0) {
      const booking = res.body[0];
      expect(booking).toHaveProperty("booking_id");
      expect(booking).toHaveProperty("event_id");
      expect(booking).toHaveProperty("ticket_id");
      expect(booking).toHaveProperty("quantity");
    }
  });

  it("should link the booking to logged-in user", async () => {
    // create the booking
    await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 2 });

    // call bookings with a token
    const res = await request(app)
      .get("/api/bookings/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.length).toBeGreaterThan(0);
    const userId = res.body[0].user_id;
    res.body.forEach((b: any) => expect(b.user_id).toBe(userId));
  });

  it("should exist in booking_items", async () => {});

  // errors:
  // test: no token - invalid token
  // test: no event
  // test: event in the past
  // test: ticket not found
  // test: ticket does not belong to event
  // test: not enough tickets
  // test: on faliure, ton't reduce ticketS!
  // test: expects not to be 500
  // test: no integer values
  // test: missing inputs
});
