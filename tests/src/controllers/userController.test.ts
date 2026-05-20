import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { pool } from "../../../database/database.js";
import {
  createNewUserHandler,
  loginUser,
} from "../../../src/controllers/userController.js";

const signupEmail = `controller-signup-${Date.now()}@example.com`;
const loginEmail = `controller-login-${Date.now()}@example.com`;
const password = "Password123!";
const customerId = 42;

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
    redirectPath: "",
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
    redirect(path: string) {
      this.redirectPath = path;
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
        return [[{ customer_id: customerId }]];
      }

      return [{ affectedRows: 1, insertId: customerId }];
    });
    const req = { body: makeSignupBody(signupEmail), user: null } as any;
    const res = makeResponse() as any;

    await createNewUserHandler(req, res);

    assert.equal(res.redirectPath, "confirmationSignUp");
  });

  it("mock data only, then test signup handler creates customer and user with the same customer id", async () => {
    mock.method(console, "log", () => {});
    const queryMock = mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT customer_id")) {
        return [[{ customer_id: customerId }]];
      }

      return [{ affectedRows: 1, insertId: customerId }];
    });
    const req = { body: makeSignupBody(signupEmail), user: null } as any;
    const res = makeResponse() as any;

    await createNewUserHandler(req, res);

    assert.equal(res.redirectPath, "confirmationSignUp");
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [signupEmail]);
    assert.equal(queryMock.mock.calls[2].arguments[1][2], customerId);
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

    assert.equal(res.redirectPath, "/reserve/reservations");
    assert.equal(res.cookieName, "auth_session");
    assert.ok(res.cookieValue.includes("."));
  });

  it("mock data only, then test login handler rejects wrong password", async () => {
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
    const req = {
      body: { email: loginEmail, password: "WrongPassword123!" },
      user: null,
    } as any;
    const res = makeResponse() as any;

    await loginUser(req, res);

    assert.equal(res.viewName, "login");
    assert.equal(res.viewData.error, "Incorrect email and/or password");
  });
});
