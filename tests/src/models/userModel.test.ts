import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import {
  create_customer,
  create_user,
  get_all_emails,
  get_user,
} from "../../../src/models/userModel.js";

const signupEmail = `model-signup-${Date.now()}@example.com`;
const loginEmail = `model-login-${Date.now()}@example.com`;
const customerId = 42;

afterEach(() => {
  mock.restoreAll();
});

describe("userModel create new user (signup) tests", () => {
  it("mock data only, then test create_customer with proper signup data", async () => {
    const queryMock = mock.method(pool, "query", async () => [{
      affectedRows: 1,
      insertId: customerId,
    }]);

    await create_customer("jane", signupEmail, "6045551234", "student", "doe");

    assert.equal(queryMock.mock.calls.length, 1);
    assert.deepEqual(queryMock.mock.calls[0].arguments[1], [
      "jane",
      signupEmail,
      "6045551234",
      "student",
      "doe",
    ]);
  });

  it("mock data only, then test create_customer maps signup data to the new customer columns", async () => {
    const queryMock = mock.method(pool, "query", async () => [{
      affectedRows: 1,
      insertId: customerId,
    }]);

    await create_customer("jane", signupEmail, "6045551234", "student", "doe");

    assert.match(queryMock.mock.calls[0].arguments[0], /first_name/);
    assert.match(queryMock.mock.calls[0].arguments[0], /last_name/);
    assert.match(queryMock.mock.calls[0].arguments[0], /valid_permits/);
  });
});

describe("userModel login (signin) tests", () => {
  it("mock data only, then test create_user with proper login data", async () => {
    const queryMock = mock.method(pool, "query", async () => [{ affectedRows: 1 }]);

    await create_user(loginEmail, "hashed-password");

    assert.equal(queryMock.mock.calls.length, 1);
    assert.match(queryMock.mock.calls[0].arguments[0], /INSERT INTO users/);
    assert.deepEqual(queryMock.mock.calls[0].arguments[1], [
      loginEmail,
      "hashed-password",
    ]);
  });

  it("mock data only, then test customer and user creation both run", async () => {
    const queryMock = mock.method(pool, "query", async () => [{
      affectedRows: 1,
      insertId: customerId,
    }]);

    await create_customer("jane", loginEmail, "6045551234", "student", "doe");
    await create_user(loginEmail, "hashed-password");

    assert.equal(queryMock.mock.calls.length, 2);
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [
      loginEmail,
      "hashed-password",
    ]);
  });

  it("mock data only, then test get_user returns login data", async () => {
    mock.method(pool, "query", async () => [[{
      id: 1,
      email: loginEmail,
      password_hash: "hashed-password",
    }]]);

    const user: any = await get_user(loginEmail);

    assert.equal(user.email, loginEmail);
    assert.equal(user.password_hash, "hashed-password");
  });

  it("mock data only, then test get_all_emails returns customer emails", async () => {
    mock.method(pool, "query", async () => [[
      { email: signupEmail },
      { email: loginEmail },
    ]]);

    const emails: any = await get_all_emails();

    assert.deepEqual(emails, [
      { email: signupEmail },
      { email: loginEmail },
    ]);
  });
});
