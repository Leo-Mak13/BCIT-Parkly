import { describe, after, it, beforeEach, afterEach } from "node:test";
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

describe("Trigger: validate_stall_in_lot", () => {
    it("should throw an error if the stall is not it the lot specified in the reservation", async () => {
        await assert.rejects(
            testPool.query(
                `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
                ["TESTBB", 5.0, "L2-02", 1, 60, 4],
            ),
        );
    });
});

describe("Trigger: occupy_stall_on_reservation", () => {
    it("should set the stall to occupied after making a reservation", async () => {
        await testPool.query(
            `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            ["TESTDD", 5.0, "L2-02", 2, 60, 4],
        );
    });
});

after(async () => {
    await pool.end();
});
