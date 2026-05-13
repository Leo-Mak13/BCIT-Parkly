import { pool } from "../../database/database.js";

async function get_reservations(id: number) {
  const [output] = await pool.query(
    `
        SELECT reservation_id, stall_location, purchase_date, total_cost, license_plate FROM reservations
        SELECT reservation_id, stall_location, purchase_date, total_cost, license_plate FROM reservations
        WHERE customer_id = ?
    `,
    [id],
  );
  return output;
}
async function get_reservation(id: number) {
  const [output] = await pool.query(
    `
        select customer_id, stall_location, total_cost, purchase_date, parking_lots.lot_name, parking_lots.lot_floor, parking_stalls.parking_type, parking_lot_address.street, parking_lot_address.city, parking_lot_address.province FROM reservations
        INNER JOIN parking_lots ON reservations.lot_id = parking_lots.lot_id
        INNER JOIN parking_stalls ON reservations.stall_id = parking_stalls.stall_id
        INNER JOIN parking_lot_address ON parking_lots.lot_id = parking_lot_address.lot_id
        WHERE reservation_id = ?
        `,
    [id],
  );
  return output;
}
async function edit_reservation(
  license_plate: string,
  total_cost: number,
  stall_location: string,
  lot_id: string,
  stall_id: number,
  reservation_id: string,
) {
  const [result] = await pool.query(
    `
      UPDATE reservations
        SET license_plate = ?,
        total_cost = ?,
        stall_location = ?,
        lot_id = (SELECT lot_id FROM parking_lots WHERE lot_name = ?)
        stall_id = ?
      WHERE reservation_id = ?
        `,
    [
      license_plate,
      total_cost,
      stall_location,
      lot_id,
      stall_id,
      reservation_id,
    ],
  );
}

async function create_reservation(
  license_plate: string,
  total_cost: number,
  stall_location: string,
  lot_id: number,
  stall_id: number,
  customer_id: number,
) {
  const [result] = await pool.query(
    `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
        VALUES(?, ?, ?, ?, ?, ?)`,
    [license_plate, total_cost, stall_location, lot_id, stall_id, customer_id],
  );
}

export {
  get_reservations,
  get_reservation,
  edit_reservation,
  create_reservation,
};
