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

describe("Trigger: validate_customer_permit", () => {
    it("should prevent reservations if customer doesn't have valid permit", async () => {
        await testPool.query(
            `DELETE FROM parking_lot_valid_permits WHERE lot_id = 3 AND valid_permits = 'staff'`,
        );
        await assert.rejects(
            testPool.query(
                `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
                ["TESTCC", 5.0, "L3-01", 3, 89, 4],
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

        const [stall]: any = await testPool.query(
            `SELECT occupied FROM parking_stalls WHERE stall_id = 60`,
        );

        assert.ok(stall[0].occupied);
    });
});

describe("Trigger: unoccupy_stall_on_reservation_delete", () => {
    it("set stall to unoccupied after deleting reservation", async () => {
        await testPool.query(
            `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            ["TESTDD", 5.0, "L2-02", 2, 60, 4],
        );
        await testPool.query(
            `DELETE FROM reservations WHERE license_plate = ?`,
            ["TESTDD"],
        );

        const [stall]: any = await testPool.query(
            `SELECT occupied FROM parking_stalls WHERE stall_id = 60`,
        );

        assert.ok(!stall[0].occupied);
    });
});

describe("Trigger: update_stall_occupancy_on_reservation_update", () => {
    //reject test
    it("should prevent reserving occupied stall when updating reservation", async () => {
        await testPool.query(
            `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            ["TESTDD", 5.0, "L2-02", 2, 60, 4],
        );
        await assert.rejects(
            testPool.query(
                `UPDATE reservations SET stall_id = ?, lot_id = ? WHERE license_plate = ?`,
                [1, 1, "TESTDD"],
            ),
        );
    });
    //success test
    it("should allow reserving free stalls when updating reservation", async () => {
        await testPool.query(
            `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            ["TESTDD", 5.0, "L2-02", 2, 60, 4],
        );
        await testPool.query(
            `UPDATE reservations SET stall_id = ? WHERE license_plate = ?`,
            [62, "TESTDD"],
        );

        const [oldOccupancy]: any = await testPool.query(
            `SELECT occupied FROM parking_stalls WHERE stall_id = 60`,
        );
        const [newOccupancy]: any = await testPool.query(
            `SELECT occupied FROM parking_stalls WHERE stall_id = 62`,
        );

        assert.ok(!oldOccupancy[0].occupied);
        assert.ok(newOccupancy[0].occupied);
    });
});

describe("Trigger: update_lot_capacity_on_stall_insert", () => {
    it("increment lot capacity by 1 when stall inserted", async () => {
        const [lotOld]: any = await testPool.query(
            `SELECT lot_capacity FROM parking_lots WHERE lot_id = 3`,
        );
        const capacityOld = lotOld[0].lot_capacity;

        await testPool.query(
            `INSERT INTO parking_stalls (occupied, parking_type, lot_id) VALUES (?, ?, ?)`,
            [false, "regular", 3],
        );

        const [lotNew]: any = await testPool.query(
            `SELECT lot_capacity FROM parking_lots WHERE lot_id = 3`,
        );
        const capacityNew = lotNew[0].lot_capacity;
        assert.equal(capacityNew, capacityOld + 1);
    });
});

describe("Trigger: update_lot_capacity_on_stall_delete", () => {
    it("decrement capacity by 1 when stall deleted", async () => {
        await testPool.query(
            `INSERT INTO parking_stalls (occupied, parking_type, lot_id) VALUES (?, ?, ?)`,
            [false, "regular", 3],
        );

        const [lotOld]: any = await testPool.query(
            `SELECT lot_capacity FROM parking_lots WHERE lot_id = 3`,
        );
        const capacityOld = lotOld[0].lot_capacity;

        await testPool.query(
            `DELETE FROM parking_stalls WHERE stall_id = LAST_INSERT_ID()`,
        );

        const [lotNew]: any = await testPool.query(
            `SELECT lot_capacity FROM parking_lots WHERE lot_id = 3`,
        );
        const capacityNew = lotNew[0].lot_capacity;

        assert.equal(capacityNew, capacityOld - 1);
    });
});

after(async () => {
    await pool.end();
});
