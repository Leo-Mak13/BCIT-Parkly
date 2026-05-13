import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import { getLotAvailability } from "../../../src/services/lotService.js";

describe("lotService database tests", () => {
  it("getLotAvailability returns parking lots", async () => {
    const lots = await getLotAvailability();

    assert.ok(Array.isArray(lots));
    assert.ok(lots.length > 0);
  });

  it("getLotAvailability adds availability and open spots", async () => {
    const lots = await getLotAvailability();
    const firstLot = lots[0];

    assert.ok(firstLot.lotId);
    assert.ok(firstLot.name);
    assert.ok(firstLot.capacity >= 0);
    assert.ok(firstLot.openSpots >= 0);
    assert.ok(
      firstLot.availability === "Available" ||
        firstLot.availability === "Limited" ||
        firstLot.availability === "Full",
    );
  });
});

after(async () => {
  await pool.end();
});
