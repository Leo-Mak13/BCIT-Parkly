import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { pool } from "../../../database/database.js";
import {
  EmailInUseError,
  IncorrectEmailPasswordError,
  PasswordMismatchError,
} from "../../../src/middleware/errorTypes.js";
import {
  createHashPassword,
  createNewCustomerUser,
  validateEmailNotUsed,
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

  it("mock data only, then test signup creates customer and user", async () => {
    const queryMock = mock.method(pool, "query", async () => [{
      affectedRows: 1,
      insertId: customerId,
    }]);

    await createNewCustomerUser(
      "Jane",
      "Doe",
      signupEmail,
      "6045551234",
      password,
      password,
      "Student",
    );

    assert.equal(queryMock.mock.calls.length, 2);
    assert.deepEqual(queryMock.mock.calls[0].arguments[1], [
      "jane",
      signupEmail,
      "6045551234",
      "student",
      "doe",
    ]);
    assert.equal(queryMock.mock.calls[1].arguments[1][0], signupEmail);
    assert.notEqual(queryMock.mock.calls[1].arguments[1][1], password);
  });

  it("mock data only, then test validateEmailNotUsed follows current email check", async () => {
    mock.method(pool, "query", async () => [{ [signupEmail]: true }]);

    const isAllowed = await validateEmailNotUsed(signupEmail);

    assert.equal(isAllowed, false);
  });

  it("mock data only, then test validateEmailNotUsed rejects missing email", async () => {
    mock.method(pool, "query", async () => [[{ email: loginEmail }]]);

    await assert.rejects(
      validateEmailNotUsed(signupEmail),
      EmailInUseError,
    );
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
    await assert.rejects(
      validateUser(loginEmail, "WrongPassword123!"),
      IncorrectEmailPasswordError,
    );
  });

  it("mock data only, then test validateUser rejects unknown email", async () => {
    mock.method(pool, "query", async () => [[]]);

    await assert.rejects(
      validateUser(loginEmail, password),
      IncorrectEmailPasswordError,
    );
  });
});
