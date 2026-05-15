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

function makeResponse() {
  return {
    statusCode: 200,
    viewName: "",
    viewData: null as any,
    body: "",
    render(viewName: string, viewData: any) {
      this.viewName = viewName;
      this.viewData = viewData;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    send(message: string) {
      this.body = message;
      return this;
    },
  };
}

function mockLotDatabase() {
  mock.method(pool, "query", async (sql: string) => {
    if (sql.includes("FROM parking_stalls")) {
      return [[{ lot_id: 1, lot_capacity: 100, occupied: 20 }]];
    }

    return [fakeLotRows];
  });
}

afterEach(() => {
  mock.restoreAll();
});

describe("lotController unit tests without database connection", () => {
  it("mock data only, then test getHomePage without MySQL", async () => {
    mockLotDatabase();
    const { getHomePage } = await import("../../../src/controllers/lotController.js");
    const req = { user: null } as any;
    const res = makeResponse() as any;

    await getHomePage(req, res);

    assert.equal(res.viewName, "main");
    assert.equal(res.viewData.parkingLots[0].name, "Test Lot");
    assert.equal(res.viewData.parkingLots[0].openSpots, 80);
  });
});

describe("lotController unit tests with database connection", () => {
  it("call getHomePage and let it use the real MySQL database", async () => {
    const { getHomePage } = await import("../../../src/controllers/lotController.js");
    const req = { user: null } as any;
    const res = makeResponse() as any;

    await getHomePage(req, res);

    assert.equal(res.viewName, "main");
    assert.ok(Array.isArray(res.viewData.parkingLots));
    assert.ok(res.viewData.parkingLots.length > 0);
  });
});

after(async () => {
  await pool.end();
});
