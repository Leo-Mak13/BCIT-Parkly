import { after, afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../database/database.js";
import {
  create_session,
  delete_session,
  get_session,
} from "../../src/models/authModel.js";

afterEach(() => {
  mock.restoreAll();
});

describe("database connection", () => {
  it("should connect to the database", async () => {
    const [rows]: any = await pool.query("SELECT 1 AS connected");

    assert.equal(rows[0].connected, 1);
  });
});

describe("create_session and delete session", () => {
  it("mock data only, then test create and retrieve session", async () => {
    const id = crypto.randomUUID();
    const secret_hash = Buffer.from("test-secret");
    const created_at = new Date();
    const fakeId = 1;
    const queryMock = mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT")) {
        return [[{
          id,
          secret_hash,
          created_at,
          user_id: fakeId,
        }]];
      }

      return [{ affectedRows: 1 }];
    });

    await create_session(id, secret_hash, created_at, fakeId);
    const rows: any = await get_session(id);

    assert.equal(queryMock.mock.calls.length, 2);
    assert.deepEqual(queryMock.mock.calls[0].arguments[1], [
      id,
      secret_hash,
      created_at,
      fakeId,
    ]);
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [id]);
    assert.equal(rows[0].id, id);
    assert.equal(rows[0].user_id, fakeId);
  });

  it("mock data only, then test delete session", async () => {
    const id = crypto.randomUUID();
    const queryMock = mock.method(pool, "query", async (sql: string) => {
      if (sql.includes("SELECT")) {
        return [[]];
      }

      return [{ affectedRows: 1 }];
    });

    await delete_session(id);
    const rows: any = await get_session(id);

    assert.equal(queryMock.mock.calls.length, 2);
    assert.deepEqual(queryMock.mock.calls[0].arguments[1], [id]);
    assert.deepEqual(queryMock.mock.calls[1].arguments[1], [id]);
    assert.deepEqual(rows, []);
  });
});

after(async () => {
  await pool.end();
});
