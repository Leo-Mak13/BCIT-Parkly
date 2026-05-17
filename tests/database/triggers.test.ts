import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../database/database.js";

let testPool: any;

beforeEach(async () => {
    testPool = await pool.getConnection();
    await testPool.beginTransaction();
});

afterEach(async () => {
    await testPool.rollback();
    testPool.release();
});

describe("Trigger: prevent_reserving_occupied", () => {
    it("should prevent reserving occupied parking stalls", async () => {
        await assert.rejects(
            testPool.query(
                `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                ["TESTPLATE", 5.0, "L1-01", 1, 1, 1],
            ),
        );
    });
});

