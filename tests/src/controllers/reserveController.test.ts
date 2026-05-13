import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import {
  get_reservation,
  get_reservations,
} from "../../../src/controllers/reserveController.js";

async function getTestReservation() {
  const [rows]: any = await pool.query(
    "SELECT reservation_id, customer_id FROM reservations LIMIT 1",
  );

  assert.ok(rows.length > 0);
  return rows[0];
}

describe("reserveController database tests", () => {
  it("get_reservations returns reservations for a customer", async () => {
    const testReservation = await getTestReservation();

    const reservations: any = await get_reservations(
      String(testReservation.customer_id),
    );

    assert.ok(Array.isArray(reservations));
    assert.ok(reservations.length > 0);
    assert.ok(reservations[0].reservation_id);
    assert.ok(reservations[0].stall_location);
  });

  it("get_reservation returns one reservation's details", async () => {
    const testReservation = await getTestReservation();

    const reservation: any = await get_reservation(
      String(testReservation.reservation_id),
    );

    assert.ok(Array.isArray(reservation));
    assert.ok(reservation.length > 0);
    assert.ok(reservation[0].stall_location);
    assert.ok(reservation[0].lot_name);
  });
});

after(async () => {
  await pool.end();
});
