import { after, afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";

const fakeLotRows = [
  {
    lot_id: 1,
    lot_name: "Test Lot",
    lot_floor: "1",
    lot_type: "student",
    lot_capacity: 100,
    lat: "49.25",
    lon: "-123.00",
    valid_permits: "student",
    lot_description: "test parking lot",
    street: "123 Test Street",
    city: "Burnaby",
    province: "BC",
    postal_code: "V5A 1S6",
    daytimePrice: "2",
    daytimeRate: "1",
    daytime_start_time: "08:00:00",
    daytime_end_time: "18:00:00",
    daytimeMaxPrice: "12",
    eveningPrice: "1",
    eveningRate: "1",
    evening_start_time: "18:00:00",
    evening_end_time: "23:00:00",
    eveningMaxPrice: "5",
    weekendPrice: "1",
    weekendRate: "1",
    weekend_start_time: "08:00:00",
    weekend_end_time: "23:00:00",
    weekendMaxPrice: "5",
    rate_unit: "hour",
  },
];

function mockLotDatabase(occupied: number) {
  mock.method(pool, "query", async (sql: string) => {
    if (sql.includes("FROM parking_stalls")) {
      return [[{ lot_id: 1, lot_capacity: 100, occupied }]];
    }

    return [fakeLotRows];
  });
}

afterEach(() => {
  mock.restoreAll();
});

describe("lotService unit tests without database connection", () => {
  it("mock data only, then test availability logic without MySQL", async () => {
    mockLotDatabase(20);
    const { getLotAvailability } = await import("../../../src/services/lotService.js");

    const lots = await getLotAvailability();

    assert.equal(lots[0]?.name, "Test Lot");
    assert.equal(lots[0]?.availability, "Available");
    assert.equal(lots[0]?.openSpots, 80);
  });
});

describe("lotService unit tests with database connection", () => {
  it("call getLotAvailability with the real MySQL database", async () => {
    const { getLotAvailability } = await import("../../../src/services/lotService.js");

    const lots = await getLotAvailability();
    const firstLot = lots[0];

    assert.ok(Array.isArray(lots));
    assert.ok(lots.length > 0);
    assert.ok(firstLot.lotId);
    assert.ok(firstLot.name);
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
