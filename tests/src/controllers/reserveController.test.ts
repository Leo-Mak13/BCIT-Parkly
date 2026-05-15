import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import {
  get_reservation,
  get_reservations,
} from "../../../src/controllers/reserveController.js";

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

afterEach(() => {
  mock.restoreAll();
});

describe("reserveController unit tests", () => {
  it("mock data only, then test get_reservations", async () => {
    mockReservationDatabase();

    const reservations: any = await get_reservations("1");

    assert.ok(Array.isArray(reservations));
    assert.equal(reservations[0].reservation_id, 1);
    assert.equal(reservations[0].stall_location, "L1-01");
  });

  it("mock data only, then test get_reservation", async () => {
    mockReservationDatabase();

    const reservation: any = await get_reservation("2");

    assert.ok(Array.isArray(reservation));
    assert.equal(reservation[0].lot_name, "Test Lot");
    assert.equal(reservation[0].parking_type, "regular");
  });
});
