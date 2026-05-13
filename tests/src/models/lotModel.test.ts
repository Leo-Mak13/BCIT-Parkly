import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import {
  getNumberOfOccupiedStalls,
  mapRowToParkingLot,
} from "../../../src/models/lotModel.js";

describe("lotModel database tests", () => {
  it("mapRowToParkingLot returns a Map of parking lots", async () => {
    const lots = await mapRowToParkingLot();

    assert.ok(lots instanceof Map);
    assert.ok(lots.size > 0);
  });

  it("mapRowToParkingLot returns parking lot details", async () => {
    const lots = await mapRowToParkingLot();
    const firstLot = lots.values().next().value;

    assert.ok(firstLot.lotId);
    assert.ok(firstLot.name);
    assert.ok(firstLot.capacity >= 0);
    assert.ok(firstLot.address);
    assert.ok(firstLot.schedule);
    assert.ok(Array.isArray(firstLot.validPermits));
  });

  it("getNumberOfOccupiedStalls returns occupied stall rows", async () => {
    const occupiedStalls = await getNumberOfOccupiedStalls();

    assert.ok(Array.isArray(occupiedStalls));

    if (occupiedStalls.length > 0) {
      assert.ok(occupiedStalls[0].lot_id);
      assert.ok(occupiedStalls[0].occupied >= 0);
    }
  });
});

after(async () => {
  await pool.end();
});
