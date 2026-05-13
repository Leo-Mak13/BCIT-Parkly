import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import {
  get_reservation,
  get_reservations,
} from "../../../src/controllers/reserveController.js";

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

describe("reserveController database tests", () => {
  it("get_reservations returns reservations for a customer", async () => {
    const testReservation = await getCustomerWithReservations();

    const reservations: any = await get_reservations(testReservation.customerId);

    assert.ok(Array.isArray(reservations));
    assert.ok(reservations.length > 0);
    assert.ok(reservations[0].reservation_id);
    assert.ok(reservations[0].stall_location);
  });

  it("get_reservation returns one reservation's details", async () => {
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
