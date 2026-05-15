import { after, afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { pool } from "../../../database/database.js";
import {
  createNewUserHandler,
  loginUser,
} from "../../../src/controllers/userController.js";
import { createNewCustomerUser } from "../../../src/services/userService.js";

const signupEmail = `controller-signup-${Date.now()}@example.com`;
const loginEmail = `controller-login-${Date.now()}@example.com`;
const password = "Password123!";

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

function makeResponse() {
  return {
    statusCode: 200,
    viewName: "",
    viewData: null as any,
    cookieName: "",
    cookieValue: "",
    render(viewName: string, viewData: any) {
      this.viewName = viewName;
      this.viewData = viewData;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    cookie(name: string, value: string) {
      this.cookieName = name;
      this.cookieValue = value;
      return this;
    },
  };
}

afterEach(() => {
  mock.restoreAll();
});

describe("userController create new user (signup) tests", () => {
  it("mock data only, then test signup handler with proper form input", async () => {
    mock.method(console, "log", () => {});
    mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT customer_id")) {
        return [[{ customer_id: 1 }]];
      }

      return [{ affectedRows: 1 }];
    });
    const req = { body: makeSignupBody(signupEmail), user: null } as any;
    const res = makeResponse() as any;

    await createNewUserHandler(req, res);

    assert.equal(res.viewName, "confirmationSignUp");
    assert.equal(res.viewData.confirmedEmail, signupEmail);
  });

  it("uses the real database to create a user with proper signup input", async () => {
    mock.method(console, "log", () => {});
    const req = { body: makeSignupBody(signupEmail), user: null } as any;
    const res = makeResponse() as any;

    await createNewUserHandler(req, res);

    assert.equal(res.viewName, "confirmationSignUp");
    assert.equal(res.viewData.confirmedEmail, signupEmail);
  });
});

describe("userController login (signin) tests", () => {
  it("mock data only, then test login handler with proper email and password", async () => {
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
    const req = {
      body: { email: loginEmail, password },
      user: null,
    } as any;
    const res = makeResponse() as any;

    await loginUser(req, res);

    assert.equal(res.viewName, "test");
    assert.equal(res.cookieName, "auth_session");
    assert.ok(res.cookieValue.includes("."));
  });

  it("uses the real database to sign in with proper email and password", async () => {
    await createNewCustomerUser(
      "Jane",
      "Doe",
      loginEmail,
      "6045551234",
      password,
      password,
      "Student",
    );
    const req = {
      body: { email: loginEmail, password },
      user: null,
    } as any;
    const res = makeResponse() as any;

    await loginUser(req, res);

    assert.equal(res.viewName, "test");
    assert.equal(res.cookieName, "auth_session");
    assert.ok(res.cookieValue.includes("."));
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
