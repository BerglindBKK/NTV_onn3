/// <reference types="vitest" />

import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.js";

describe("Signup", () => {
  it("allows a new user to create an account", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Tester",
      email: "test@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@test.com");

    const row = await db.one("SELECT * FROM users WHERE email=$1", [
      "test@test.com",
    ]);

    expect(row).toBeDefined();
    expect(row.password_hash).not.toBe("password123");
  });

  it("should not allow duplicate email", async () => {
    //create two users wit identical emails
    await request(app).post("/api/auth/signup").send({
      name: "Test1",
      email: "test@test.com",
      password: "password1",
    });

    const res = await request(app).post("/api/auth/signup").send({
      name: "Test2",
      email: "test@test.com",
      password: "password2",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should fail when missing email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@test.com",
    });
    expect(res.status).toBe(400);
  });

  it("should fail when missing password", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      password: "password2",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Login", () => {
  it("login user and return JWT", async () => {
    // await request(app).post("/api/auth/signup").send({
    //   name: "Test1",
    //   email: "test@test.com",
    //   password: "password11",
    // });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "password123",
    });
    // const allUsers = await db.any("SELECT * FROM users");
    // console.log("Users in DB:", allUsers);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    // await request(app).post("/api/auth/signup").send({
    //   name: "Test1",
    //   email: "test@test.com",
    //   password: "password1",
    // });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "password2",
    });

    expect(res.statusCode).toBe(401);
  });
  //   //todo
  it("should fail for non-existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test_ekkitil@test.com",
      password: "password2",
    });

    expect(res.statusCode).toBe(401);
  });
});
