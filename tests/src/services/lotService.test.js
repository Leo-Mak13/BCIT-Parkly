import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { getLotAvailability } from "../../../src/services/lotService.js";
describe("getLotAvailability", () => {
    it("should return parking lots with availability and openSpots", async () => {
        const lots = await getLotAvailability();
        assert.ok(Array.isArray(lots));
        if (lots.length > 0) {
            const firstLot = lots[0];
            assert.ok(firstLot.lotId);
            assert.ok(firstLot.name);
            assert.ok(firstLot.capacity >= 0);
            assert.ok(firstLot.availability === "Available" ||
                firstLot.availability === "Limited" ||
                firstLot.availability === "Full");
            assert.ok(firstLot.openSpots >= 0);
        }
    });
});
