import { after, afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
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

function mockLotDatabase() {
  mock.method(pool, "query", async (sql: string) => {
    if (sql.includes("FROM parking_stalls")) {
      return [[{ lot_id: 1, lot_capacity: 100, occupied: 20 }]];
    }

    return [fakeLotRows];
  });
}

async function makeApp() {
  const { default: lotRoutes } = await import("../../../src/routes/lotRoutes.js");
  const app = express();

  app.use(cookieParser());
  app.engine("ejs", (_file, options: any, callback) => {
    callback(null, JSON.stringify({
      parkingLots: options.parkingLots,
      user: options.user,
    }));
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
  app.use("/", lotRoutes);

  return app;
}

afterEach(() => {
  mock.restoreAll();
});

describe("lotRoutes integration tests without database connection", () => {
  it("mock data only, then test GET / through Express without MySQL", async () => {
    mockLotDatabase();

    const response = await request(await makeApp()).get("/");
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.equal(body.parkingLots[0].name, "Test Lot");
    assert.equal(body.parkingLots[0].openSpots, 80);
  });
});

describe("lotRoutes integration tests with database connection", () => {
  it("test GET / through Express with the real MySQL database", async () => {
    const response = await request(await makeApp()).get("/");
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.parkingLots));
    assert.ok(body.parkingLots.length > 0);
    assert.ok(body.parkingLots[0].name);
  });
});

after(async () => {
  await pool.end();
});
