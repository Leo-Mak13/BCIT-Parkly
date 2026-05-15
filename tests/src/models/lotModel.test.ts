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

const fakeOccupiedRows = [{ lot_id: 1, lot_capacity: 100, occupied: 25 }];

function mockLotDatabase() {
  mock.method(pool, "query", async (sql: string) => {
    if (sql.includes("FROM parking_stalls")) {
      return [fakeOccupiedRows];
    }

    return [fakeLotRows];
  });
}

afterEach(() => {
  mock.restoreAll();
});

describe("lotModel unit tests without database connection", () => {
  it("mock data only, then test mapRowToParkingLot without MySQL", async () => {
    mockLotDatabase();
    const { mapRowToParkingLot } = await import("../../../src/models/lotModel.js");

    const lots = await mapRowToParkingLot();
    const lot = lots.get(1);

    assert.ok(lots instanceof Map);
    assert.equal(lot?.name, "Test Lot");
    assert.equal(lot?.address.city, "Burnaby");
    assert.deepEqual(lot?.validPermits, ["student"]);
  });

  it("mock data only, then test getNumberOfOccupiedStalls without MySQL", async () => {
    mockLotDatabase();
    const { getNumberOfOccupiedStalls } = await import(
      "../../../src/models/lotModel.js"
    );

    const occupiedStalls = await getNumberOfOccupiedStalls();

    assert.deepEqual(occupiedStalls, fakeOccupiedRows);
  });
});

describe("lotModel unit tests with database connection", () => {
  it("call mapRowToParkingLot with the real MySQL database", async () => {
    const { mapRowToParkingLot } = await import("../../../src/models/lotModel.js");

    const lots = await mapRowToParkingLot();
    const firstLot = lots.values().next().value;

    assert.ok(lots instanceof Map);
    assert.ok(lots.size > 0);
    assert.ok(firstLot.lotId);
    assert.ok(firstLot.name);
    assert.ok(firstLot.address);
    assert.ok(firstLot.schedule);
  });

  it("call getNumberOfOccupiedStalls with the real MySQL database", async () => {
    const { getNumberOfOccupiedStalls } = await import(
      "../../../src/models/lotModel.js"
    );

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
