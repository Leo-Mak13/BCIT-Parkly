import { after, afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pool } from "../../../database/database.js";
import userRoute from "../../../src/routes/userRoute.js";
import { createNewCustomerUser } from "../../../src/services/userService.js";

const signupEmail = `route-signup-${Date.now()}@example.com`;
const loginEmail = `route-login-${Date.now()}@example.com`;
const password = "Password123!";
const testViewsDir = fs.mkdtempSync(path.join(os.tmpdir(), "user-route-views-"));

for (const viewName of ["confirmationSignUp", "login", "signup", "test"]) {
  fs.writeFileSync(path.join(testViewsDir, `${viewName}.ejs`), "");
}

function makeSignupBody(email: string) {
  return {
    firstName: "Jane",
    lastName: "Doe",
    email,
    phoneNumber: "6045551234",
    firstGoPassword: password,
    secondGoPassword: password,
    role: "Student",
  };
}

function makeApp() {
  const app = express();

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.engine("ejs", (_file, options: any, callback) => {
    callback(null, JSON.stringify(options));
  });
  app.set("view engine", "ejs");
  app.set("views", testViewsDir);
  app.use("/users", userRoute);

  return app;
}

afterEach(() => {
  mock.restoreAll();
});

describe("userRoute create new user (signup) tests", () => {
  it("mock data only, then test POST /users/signup with proper form input", async () => {
    mock.method(console, "log", () => {});
    mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT customer_id")) {
        return [[{ customer_id: 1 }]];
      }

      return [{ affectedRows: 1 }];
    });

    const response = await request(makeApp())
      .post("/users/signup")
      .type("form")
      .send(makeSignupBody(signupEmail));
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.equal(body.confirmedEmail, signupEmail);
  });

  it("uses the real database to test POST /users/signup with proper form input", async () => {
    mock.method(console, "log", () => {});
    const response = await request(makeApp())
      .post("/users/signup")
      .type("form")
      .send(makeSignupBody(signupEmail));
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.equal(body.confirmedEmail, signupEmail);
  });
});

describe("userRoute login (signin) tests", () => {
  it("mock data only, then test POST /users/login with proper email and password", async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT")) {
        return [[{
          id: 1,
          email: loginEmail,
          password_hash: hashedPassword,
        }]];
      }

      return [{ affectedRows: 1 }];
    });

    const response = await request(makeApp()).post("/users/login").type("form").send({
      email: loginEmail,
      password,
    });
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.equal(body.error, null);
    assert.ok(response.headers["set-cookie"]);
  });

  it("uses the real database to test POST /users/login with proper email and password", async () => {
    await createNewCustomerUser(
      "Jane",
      "Doe",
      loginEmail,
      "6045551234",
      password,
      password,
      "Student",
    );

    const response = await request(makeApp()).post("/users/login").type("form").send({
      email: loginEmail,
      password,
    });
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.equal(body.error, null);
    assert.ok(response.headers["set-cookie"]);
  });
});

after(async () => {
  await pool.query(
    "DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE email IN (?, ?))",
    [signupEmail, loginEmail],
  );
  await pool.query("DELETE FROM users WHERE email IN (?, ?)", [
    signupEmail,
    loginEmail,
  ]);
  await pool.query("DELETE FROM customers WHERE email IN (?, ?)", [
    signupEmail,
    loginEmail,
  ]);
  await pool.end();
});
