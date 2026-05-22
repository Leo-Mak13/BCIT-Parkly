import { describe, after, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../database/database.js";

let testPool: any;

// start a transaction DON'T CHANGE
beforeEach(async () => {
    testPool = await pool.getConnection();
    await testPool.beginTransaction();
});

// rollback all test changes after finished DON'T CHANGE
afterEach(async () => {
    await testPool.rollback();
    testPool.release();
});


after(async () => {
    await pool.end();
});