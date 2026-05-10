import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { mapRowToParkingLot, getNumberOfOccupiedStalls } from "../../../src/models/lotModel.js";
import { pool } from "../../../database/database.js";
describe("mapRowToParkingLot", () => {
    it("should return a Map", async () => {
        const lots = await mapRowToParkingLot();
        assert.ok(lots instanceof Map);
    });
    it("should contain parking lot data", async () => {
        const lots = await mapRowToParkingLot();
        assert.ok(lots.size > 0);
        const firstLot = lots.values().next().value;
        assert.ok(firstLot.lotId);
        assert.ok(firstLot.name);
        assert.ok(firstLot.address);
        assert.ok(firstLot.schedule);
        assert.ok(Array.isArray(firstLot.validPermits));
    });
});
describe("getNumberOfOccupiedStalls", () => {
    it("should return numbers back", async () => {
        const lotsMap = await mapRowToParkingLot();
        const lots = Array.from(lotsMap.values());
        const occupiedStalls = await getNumberOfOccupiedStalls(lots);
        assert.ok(occupiedStalls[0].count >= 0);
    });
});
after(async () => {
    await pool.end();
});
