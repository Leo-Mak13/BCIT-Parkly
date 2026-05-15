import { afterEach, describe, it, mock } from "node:test";
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

const signupEmail = `route-signup-${Date.now()}@example.com`;
const loginEmail = `route-login-${Date.now()}@example.com`;
const password = "Password123!";
const customerId = 42;
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
        return [[{ customer_id: customerId }]];
      }

      return [{ affectedRows: 1, insertId: customerId }];
    });

    const response = await request(makeApp())
      .post("/users/signup")
      .type("form")
      .send(makeSignupBody(signupEmail));

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "confirmationSignUp");
  });

  it("mock data only, then test POST /users/signup creates customer and user with the same customer id", async () => {
    mock.method(console, "log", () => {});
    const queryMock = mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT customer_id")) {
        return [[{ customer_id: customerId }]];
      }

      return [{ affectedRows: 1, insertId: customerId }];
    });

    const response = await request(makeApp())
      .post("/users/signup")
      .type("form")
      .send(makeSignupBody(signupEmail));

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "confirmationSignUp");
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [signupEmail]);
    assert.equal(queryMock.mock.calls[2].arguments[1][2], customerId);
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

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "/reserve/reservations");
    assert.ok(response.headers["set-cookie"]);
  });

  it("mock data only, then test POST /users/login rejects wrong password", async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT")) {
        return [[{
          id: customerId,
          email: loginEmail,
          password_hash: hashedPassword,
        }]];
      }

      return [{ affectedRows: 1 }];
    });

    const response = await request(makeApp()).post("/users/login").type("form").send({
      email: loginEmail,
      password: "WrongPassword123!",
    });
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.equal(body.error, "Incorrect email and/or password");
  });
});
