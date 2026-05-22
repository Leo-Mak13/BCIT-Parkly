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

describe("Event: free_stalls_on_reservation_expiry", () => {
    it("should unoccupy stall where reservation end_time has passed", async () => {
        await testPool.query(
            `INSERT INTO reservations (license_plate, total_cost, start_time, end_time, lot_id, stall_id, customer_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ["TESTEXP", 5.0, "2020-01-01 08:00:00", "2020-01-01 10:00:00", 2, 16, 4],
        );
        await testPool.query(
            `UPDATE parking_stalls
            SET occupied = FALSE
            WHERE stall_id IN (
                SELECT stall_id FROM reservations WHERE end_time < NOW()
            )
            AND stall_id NOT IN (
                SELECT stall_id FROM reservations WHERE start_time <= NOW() AND end_time > NOW()
            )`,
        );

        const [stall]: any = await testPool.query(
            `SELECT occupied FROM parking_stalls WHERE stall_id = 16`,
        );

        assert.ok(!stall[0].occupied);
    });

    it("should leave stall occupied when reservation not yet ended", async () => {
        await testPool.query(
            `INSERT INTO reservations (license_plate, total_cost, start_time, end_time, lot_id, stall_id, customer_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ["TESTFUT", 5.0, "2099-01-01 08:00:00", "2099-01-01 10:00:00", 2, 16, 4],
        );
        await testPool.query(
            `UPDATE parking_stalls
            SET occupied = FALSE
            WHERE stall_id IN (
                SELECT stall_id FROM reservations WHERE end_time < NOW()
            )
            AND stall_id NOT IN (
                SELECT stall_id FROM reservations WHERE start_time <= NOW() AND end_time > NOW()
            )`,
        );

        const [stall]: any = await testPool.query(
            `SELECT occupied FROM parking_stalls WHERE stall_id = 16`,
        );

        assert.ok(stall[0].occupied);
    });

    it("should exists in the database", async () => {
        const [events]: any = await testPool.query(
            `SHOW EVENTS WHERE Name = 'free_stalls_on_reservation_expiry'`,
        );
        assert.equal(events.length, 1);
        assert.equal(events[0].Status, "ENABLED");
    });
});

after(async () => {
    await pool.end();
});