/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app";

describe("PATCH /users/me", () => {
  //uses same signup, login and token for all  PATCH tests
  let token: string;
  beforeAll(async () => {
    //sign up for all PATCH
    await request(app).post("/api/auth/signup").send({
      name: "patchbookingstester",
      email: "patchbookingstester@test.com",
      password: "patchbookingspassword",
    });
    //login for all PATCH
    const res = await request(app).post("/api/auth/login").send({
      email: "patchbookingstester@test.com",
      password: "patchbookingspassword",
    });

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

  it("only allows unique emails (400)", async () => {
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

    expect(res.statusCode).toBe(400);
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

  it("rejects empty body", async () => {
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
