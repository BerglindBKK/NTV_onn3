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
      expect(booking).toHaveProperty("title");
      expect(booking).toHaveProperty("quantity");
      expect(booking).toHaveProperty("price");
    }
  });

  // errors
  it("fails without a token", async () => {
    // call bookings without a token
    const res = await request(app).get("/api/bookings/me");
    //expecting results
    expect(res.status).toBe(401);
  });
});

describe("POST /bookings", () => {
  let token: string;
  //uses same signup, login and token for all POST tests
  beforeAll(async () => {
    //sign up for all POST
    await request(app).post("/api/auth/signup").send({
      name: "postbookingstester",
      email: "postbookingstester@test.com",
      password: "postbookingspassword",
    });

    //login for all POST
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
    expect(res.body).toHaveProperty("booking_id");
    expect(res.body).toHaveProperty("event_id");
    expect(res.body).toHaveProperty("ticket_id");
    expect(res.body).toHaveProperty("quantity");
  });

  // tokens errors
  it("should fail without token", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({ event_id: 1, ticket_id: 1, quantity: 2 });

    expect(res.status).toBe(401);
  });

  it("should fail with invalid token", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer invalid.token`)
      .send({ event_id: 1, ticket_id: 1, quantity: 2 });

    expect(res.status).toBe(401);
  });

  //event errors
  it("should fail if event is not found", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 999, ticket_id: 1, quantity: 2 });

    expect(res.status).toBe(404);
  });

  it("should fail if event is in the past", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 2, ticket_id: 2, quantity: 2 });

    expect(res.status).toBe(409);
  });

  //ticket errors
  it("should fail if ticket is not found", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 999, quantity: 2 });

    expect(res.status).toBe(404);
  });

  it("should fail if ticket does not belong to event", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 2, quantity: 2 });

    expect(res.status).toBe(409);
  });

  it("should fail if not enough tickets in stock", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 4, ticket_id: 4, quantity: 2 });

    expect(res.status).toBe(409);
  });

  it("should not reduce tickets if booking fails", async () => {
    // check original stock
    const before = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);
    // create the failing booking
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 2, ticket_id: 1, quantity: 2 });

    //check stock after booking
    const after = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);
    //expecting the stock NOT to be reduced by the number of quantity
    expect(after.stock).toBe(before.stock);
  });

  it("should fail with invalid input", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: "b", ticket_id: 1, quantity: 1 });

    expect(res.status).toBe(400);
  });

  it("should fail with missing input", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ ticket_id: 1, quantity: 1 });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /bookings/:id", () => {
  //happy path
  let token: string;
  //uses same signup, login and token for all POST tests
  beforeAll(async () => {
    //sign up for all DELETE
    await request(app).post("/api/auth/signup").send({
      name: "deletebookingstester",
      email: "deletebookingstester@test.com",
      password: "deletebookingspassword",
    });

    //login for all DELETE
    const res = await request(app).post("/api/auth/login").send({
      email: "deletebookingstester@test.com",
      password: "deletebookingspassword",
    });
    token = res.body.token;
  });

  it("cancels a booking and returns 200", async () => {
    // create booking with a token
    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });

    const bookingId = createRes.body.booking_id;

    //delete the same booking
    const res = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    //expecting results
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Booking cancelled successfully");
  });

  it("removes booking from booking history", async () => {
    // create booking with a token
    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });

    const bookingId = createRes.body.booking_id;

    //delete the same booking
    const deleteres = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    // call bookings with a token
    const getres = await request(app)
      .get("/api/bookings/me")
      .set("Authorization", `Bearer ${token}`);

    //check if booking id exists
    const ids = getres.body.map((b: any) => b.id);
    expect(ids).not.toContain(bookingId);
  });
  it("restores ticket stock", async () => {
    // check original stock
    const before = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);

    // create booking with a token
    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });

    const bookingId = createRes.body.booking_id;

    //delete the same booking
    const deleteres = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    //check stock after booking
    const after = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);
    //expecting the stock NOT to be reduced by the number of quantity
    expect(after.stock).toBe(before.stock);
  });

  //errors
  it("fails if booking is not found (404)", async () => {
    const deleteres = await request(app)
      .delete(`/api/bookings/9999`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteres.status).toBe(404);
    expect(deleteres.body).toHaveProperty("error");
  });

  it("fails if booking belongs to another user (403)", async () => {
    //wrong person signs up
    await request(app).post("/api/auth/signup").send({
      name: "wrongdeletebookingstester",
      email: "wrongdeletebookingstester@test.com",
      password: "wrongdeletebookingspassword",
    });

    //wrong person logs in and gets a token
    const wronglogin = await request(app).post("/api/auth/login").send({
      email: "wrongdeletebookingstester@test.com",
      password: "wrongdeletebookingspassword",
    });
    const wrongtoken = wronglogin.body.token;

    //correct user creates a booking
    const correctCreateRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });

    const bookingId = correctCreateRes.body.booking_id;

    //wrong user tries to delete the booking
    const wrongDeleteRes = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${wrongtoken}`);

    expect(wrongDeleteRes.status).toBe(403);
    expect(wrongDeleteRes.body).toHaveProperty("error");
  });
  it("fails if less than 24h until event (409)", async () => {
    //gets a ticket for event 3 (event less than 24h away)
    const ticket = await db.one("SELECT id FROM tickets WHERE event_id=$1", [
      3,
    ]);

    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 3, ticket_id: ticket.id, quantity: 1 });

    const bookingId = createRes.body.booking_id;

    //tries to delete the booking
    const res = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });
});
