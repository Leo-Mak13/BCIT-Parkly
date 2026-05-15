import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { pool } from "../../../database/database.js";

const fakeReservations = [
  {
    reservation_id: 1,
    stall_location: "L1-01",
    purchase_date: new Date(),
    total_cost: 5,
    license_plate: "TEST123",
  },
];

const fakeReservationDetails = [
  {
    stall_location: "L1-01",
    total_cost: 5,
    purchase_date: new Date(),
    lot_floor: "1",
    lot_name: "Test Lot",
    parking_type: "regular",
  },
];

function mockReservationDatabase() {
  mock.method(pool, "query", async (_query: string, params: string[]) => {
    if (params[0] === "1") {
      return [fakeReservations];
    }

    return [fakeReservationDetails];
  });
}

async function makeApp() {
  const { default: reserveRoute } = await import("../../../src/routes/reserveRoute.js");
  const app = express();

  app.use(cookieParser());
  app.engine("ejs", (_file, options: any, callback) => {
    callback(null, JSON.stringify(options));
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
  app.use("/reserve", reserveRoute);

  return app;
}

afterEach(() => {
  mock.restoreAll();
});

describe("reserveRoute integration tests", () => {
  it("mock data only, then test GET /reserve/:customer_id through Express", async () => {
    mockReservationDatabase();

    const response = await request(await makeApp()).get("/reserve/1");
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.reservations));
    assert.equal(body.reservations[0].reservation_id, 1);
    assert.equal(body.reservations[0].stall_location, "L1-01");
  });

  it("mock data only, then test GET /reserve/view/:reservation_id through Express", async () => {
    mockReservationDatabase();

    const response = await request(await makeApp()).get("/reserve/view/2");
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.reservation));
    assert.equal(body.reservation[0].lot_name, "Test Lot");
    assert.equal(body.reservation[0].parking_type, "regular");
  });
});
