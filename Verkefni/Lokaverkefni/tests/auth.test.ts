/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.js";

describe("Signup", () => {
  it("allows a new user to create an account", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Signuptester",
      email: "signuptest@test.com",
      password: "signuppassword",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("signuptest@test.com");

    const row = await db.one("SELECT * FROM users WHERE email=$1", [
      "signuptest@test.com",
    ]);

    expect(row).toBeDefined();
    expect(row.password_hash).not.toBe("password123");
  });

  it("should not allow duplicate email", async () => {
    //create two users wit identical emails
    await request(app).post("/api/auth/signup").send({
      name: "noduplicate1",
      email: "noduplicate@test.com",
      password: "noduplicatepassword1",
    });

    const res = await request(app).post("/api/auth/signup").send({
      name: "noduplicate2",
      email: "noduplicate@test.com",
      password: "noduplicatepassword",
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it("should fail when missing password", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "missingpassword@test.com",
    });
    expect(res.status).toBe(400);
  });

  it("should not store password in text form", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "pwnotintextform",
      email: "pwnotintextform@test.com",
      password: "pwnotintextform",
    });
    expect(res.status).toBe(201);

    const row = await db.one("SELECT * FROM users WHERE email=$1", [
      "pwnotintextform@test.com",
    ]);

    expect(row.password_hash).not.toBe("pwnotintextform");
    expect(row.password_hash).toMatch(/^\$2[aby]\$/);
  });

  it("should fail when missing email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      password: "missingemail@test.com",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Login", () => {
  it("login user and return JWT", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Logintester",
      email: "logintest@test.com",
      password: "loginpassword",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "logintest@test.com",
      password: "loginpassword",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Wrongpasswordtester",
      email: "wronpasswordtest@test.com",
      password: "rightpassword",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wronpasswordtest@test.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should fail for non-existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexisting@test.com",
      password: "nonexistingpassword",
    });

    expect(res.statusCode).toBe(401);
  });
});
