import { after, afterEach, describe, it, mock } from "node:test";
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

async function getCustomerWithReservations() {
  for (let customerId = 1; customerId <= 20; customerId++) {
    const reservations: any = await get_reservations(String(customerId));

    if (reservations.length > 0) {
      return {
        customerId: String(customerId),
        reservationId: String(reservations[0].reservation_id),
      };
    }
  }

  throw new Error("No test reservations were found.");
}

afterEach(() => {
  mock.restoreAll();
});

describe("reserveController unit tests without database connection", () => {
  it("mock database query, then test get_reservations without MySQL", async () => {
    mockReservationDatabase();

    const reservations: any = await get_reservations("1");

    assert.ok(Array.isArray(reservations));
    assert.equal(reservations[0].reservation_id, 1);
    assert.equal(reservations[0].stall_location, "L1-01");
  });

  it("mock database query, then test get_reservation without MySQL", async () => {
    mockReservationDatabase();

    const reservation: any = await get_reservation("2");

    assert.ok(Array.isArray(reservation));
    assert.equal(reservation[0].lot_name, "Test Lot");
    assert.equal(reservation[0].parking_type, "regular");
  });
});

describe("reserveController unit tests with database connection", () => {
  it("call get_reservations with the real MySQL database", async () => {
    const testReservation = await getCustomerWithReservations();

    const reservations: any = await get_reservations(testReservation.customerId);

    assert.ok(Array.isArray(reservations));
    assert.ok(reservations.length > 0);
    assert.ok(reservations[0].reservation_id);
    assert.ok(reservations[0].stall_location);
  });

  it("call get_reservation with the real MySQL database", async () => {
    const testReservation = await getCustomerWithReservations();

    const reservation: any = await get_reservation(testReservation.reservationId);

    assert.ok(Array.isArray(reservation));
    assert.ok(reservation.length > 0);
    assert.ok(reservation[0].stall_location);
    assert.ok(reservation[0].lot_name);
  });
});

after(async () => {
  await pool.end();
});
