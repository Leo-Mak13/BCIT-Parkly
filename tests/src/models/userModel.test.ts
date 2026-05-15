import { after, afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import {
  create_customer,
  create_user,
  get_user,
} from "../../../src/models/userModel.js";

const signupEmail = `model-signup-${Date.now()}@example.com`;
const loginEmail = `model-login-${Date.now()}@example.com`;

afterEach(() => {
  mock.restoreAll();
});

describe("userModel create new user (signup) tests", () => {
  it("mock data only, then test create_customer with proper signup data", async () => {
    const queryMock = mock.method(pool, "query", async () => [{ affectedRows: 1 }]);

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

  it("uses the real database to save proper customer signup data", async () => {
    await create_customer("jane", signupEmail, "6045551234", "student", "doe");

    const [rows]: any = await pool.query(
      "SELECT * FROM customers WHERE email = ?",
      [signupEmail],
    );

    assert.equal(rows[0].email, signupEmail);
    assert.equal(rows[0].first_name, "jane");
    assert.equal(rows[0].last_name, "doe");
  });
});

describe("userModel login (signin) tests", () => {
  it("mock data only, then test create_user with proper login data", async () => {
    const queryMock = mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT customer_id")) {
        return [[{ customer_id: 1 }]];
      }

      return [{ affectedRows: 1 }];
    });

    await create_user(loginEmail, "hashed-password");

    assert.equal(queryMock.mock.calls.length, 2);
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [
      loginEmail,
      "hashed-password",
      1,
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

  it("uses the real database to save and read proper login data", async () => {
    await create_customer("jane", loginEmail, "6045551234", "student", "doe");
    await create_user(loginEmail, "hashed-password");

    const user: any = await get_user(loginEmail);

    assert.equal(user.email, loginEmail);
    assert.equal(user.password_hash, "hashed-password");
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
