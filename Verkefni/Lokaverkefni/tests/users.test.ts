/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.js";
import crypto from "crypto";

describe("PATCH /users/me", () => {
  //uses same signup, login and token for all  PATCH tests
  let token: string;
  beforeAll(async () => {
    //sign up for all PATCH
    const signupRes = await request(app).post("/api/auth/signup").send({
      name: "patchbookingstester",
      email: "patchbookingstester@test.com",
      password: "patchbookingspassword",
    });
    expect([200, 201, 409]).toContain(signupRes.statusCode);
    //login for all PATCH
    const res = await request(app).post("/api/auth/login").send({
      email: "patchbookingstester@test.com",
      password: "patchbookingspassword",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    // get token for all PATCH
    token = res.body.token;
  });

  it("updates profile correctly and returns 200", async () => {
    //update userprofile
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
      });

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "Updated Name");
    expect(res.body).toHaveProperty("email");
  });

  it("only allows unique emails (409)", async () => {
    // create another user with the intended email
    await request(app).post("/api/auth/signup").send({
      name: "noduplicate1",
      email: "noduplicate@test.com",
      password: "noduplicatepassword1",
    });

    // try to update userprofile with the same email
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "noduplicate@test.com",
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("rejects missing token (401)", async () => {
    // try to update userprofile without a token
    const res = await request(app).patch("/api/users/me").send({
      email: "notoken@test.com",
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects invalid types", async () => {
    // try to update userprofile with invalid inputs
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it("rejects invalid body (400)", async () => {
    // try to update userprofile with invalid inputs
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: 8,
      });

    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /users/me", () => {
  //uses same signup, login and token for all DELETE tests
  let token: string;
  let email: string;
  beforeEach(async () => {
    //creates a new user for each delete test
    email = `deletebookingstester+${crypto.randomUUID()}@test.com`;
    //sign up for all DELETE
    await request(app).post("/api/auth/signup").send({
      name: "deletebookingstester",
      email,
      password: "deletebookingspassword",
    });
    //login for all DELETE
    const loginRes = await request(app).post("/api/auth/login").send({
      email,
      password: "deletebookingspassword",
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    // get token for all DELETE
    token = loginRes.body.token;
  });

  it("deletes user profile and returns 200", async () => {
    // delete user profile
    const res = await request(app)
      .delete("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    // delete with 200
    expect(res.statusCode).toBe(200);
    //check message
  });

  it("cancels future bookings and restores stock", async () => {
    // check original stock
    const before = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);

    //makes a booking
    const bookingRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({ event_id: 1, ticket_id: 1, quantity: 1 });
    const afterbooking = await db.one("SELECT stock FROM tickets WHERE id=$1", [
      1,
    ]);
    expect(bookingRes.statusCode).toBe(201);
    expect(afterbooking.stock).toBe(before.stock - 1);

    // delete user profile
    const res = await request(app)
      .delete("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    //check stock after booking and deleting
    const after = await db.one("SELECT stock FROM tickets WHERE id=$1", [1]);

    //expecting the stock NOT to be reduced by the number of quantity
    expect(after.stock).toBe(before.stock);
  });

  it("should not allow user to log in after profile is deleted - 401", async () => {
    //delete user profile
    const delRes = await request(app)
      .delete("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(delRes.statusCode).toBe(200);
    // try to log user in again
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "deletebookingspassword",
    });
    expect(res.statusCode).toBe(401);
  });
});
