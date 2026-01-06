/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app";
// import { errors } from "pg-promise";

describe("GET /bookings", () => {
  //Happy path
  it("gets all bookings for a logged in user and returns 201", async () => {});
  it("returns the correct response", async () => {});
  it("creates a booking with a working token", async () => {});

  //errors;
  it("fails without a token", async () => {});
  it("should not crash - 500", async () => {});
});

describe("POST /bookings", () => {
  //Happy path
  it("creates booking for a signed in user and returns 200", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "BookingTester",
      email: "bookingtest@test.com",
      password: "bookingpassword",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "bookingtest@test.com",
      password: "bookingpassword",
    });

    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });

    // console.log(res.status, res.body);

    expect(res.status).toBe(201);
  });

  it("reduces amount of availabe tickets after booking", async () => {});
  it("shows correct response", async () => {});
  it("should link the booking to logged in user", async () => {});
  it("should exist in booking_items", async () => {});

  // errors:
  //no token - invalid token
  //no event
  //event in the past
  //ticket not found
  //ticket does not belong to event
  //not enough tickets
  //on faliure, ton't reduce ticketS!
  //expects not to be 500
  //no integer values
  //missing inputs
});
