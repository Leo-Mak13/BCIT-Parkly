import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { pool } from "../../../database/database.js";
import { PasswordMismatchError } from "../../../src/middleware/errorTypes.js";
import {
  createHashPassword,
  createNewCustomerUser,
  validateUser,
} from "../../../src/services/userService.js";

const signupEmail = `service-signup-${Date.now()}@example.com`;
const loginEmail = `service-login-${Date.now()}@example.com`;
const password = "Password123!";
const customerId = 42;

afterEach(() => {
  mock.restoreAll();
});

describe("userService create new user (signup) tests", () => {
  it("rejects signup when passwords do not match", async () => {
    await assert.rejects(
      createNewCustomerUser(
        "Jane",
        "Doe",
        signupEmail,
        "6045551234",
        "Password123!",
        "Different123!",
        "Student",
      ),
      PasswordMismatchError,
    );
  });

  it("mock data only, then test signup creates customer and user with the same customer id", async () => {
    const queryMock = mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT customer_id")) {
        return [[{ customer_id: customerId }]];
      }

      return [{ affectedRows: 1, insertId: customerId }];
    });

    await createNewCustomerUser(
      "Jane",
      "Doe",
      signupEmail,
      "6045551234",
      password,
      password,
      "Student",
    );

    assert.equal(queryMock.mock.calls.length, 3);
    assert.deepEqual(queryMock.mock.calls[0].arguments[1], [
      "jane",
      signupEmail,
      "6045551234",
      "student",
      "doe",
    ]);
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [signupEmail]);
    assert.equal(queryMock.mock.calls[2].arguments[1][0], signupEmail);
    assert.equal(queryMock.mock.calls[2].arguments[1][2], customerId);
  });
});

describe("userService login (signin) tests", () => {
  it("test createHashPassword returns a hash for login password", async () => {
    const hashedPassword = await createHashPassword(password);

    assert.notEqual(hashedPassword, password);
  });

  it("mock data only, then test validateUser with correct login data", async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    mock.method(pool, "query", async () => [[{
      id: 1,
      email: loginEmail,
      password_hash: hashedPassword,
    }]]);

    const isValid = await validateUser(loginEmail, password);

    assert.equal(isValid, true);
  });

  it("mock data only, then test validateUser rejects wrong login password", async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    mock.method(pool, "query", async () => [[{
      id: customerId,
      email: loginEmail,
      password_hash: hashedPassword,
    }]]);
    const isValid = await validateUser(loginEmail, password);
    const isWrongPasswordValid = await validateUser(loginEmail, "WrongPassword123!");

    assert.equal(isValid, true);
    assert.equal(isWrongPasswordValid, false);
  });
});
