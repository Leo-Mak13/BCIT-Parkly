import { after, afterEach, describe, it, mock } from "node:test";
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

  it("uses the real database to create signup data", async () => {
    await createNewCustomerUser(
      "Jane",
      "Doe",
      signupEmail,
      "6045551234",
      password,
      password,
      "Student",
    );

    const isValid = await validateUser(signupEmail, password);

    assert.equal(isValid, true);
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

  it("uses the real database to validate signin data", async () => {
    await createNewCustomerUser(
      "Jane",
      "Doe",
      loginEmail,
      "6045551234",
      password,
      password,
      "Student",
    );

    const isValid = await validateUser(loginEmail, password);
    const isWrongPasswordValid = await validateUser(loginEmail, "WrongPassword123!");

    assert.equal(isValid, true);
    assert.equal(isWrongPasswordValid, false);
  });
});

after(async () => {
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
