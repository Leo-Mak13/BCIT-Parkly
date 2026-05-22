import { pool } from "../../database/database.js";

async function get_reservations(id: string) {
  const [output] = await pool.query(
    `
        SELECT reservation_id, stall_id, start_time, end_time, purchase_date, total_cost, license_plate, parking_lots.lot_floor FROM reservations
        INNER JOIN parking_lots ON reservations.lot_id = parking_lots.lot_id
        WHERE customer_id = ?
    `,
    [id],
  );
  return output;
}
async function get_reservation(id: string) {
  const [output] = await pool.query(
    `
        select customer_id, reservations.lot_id, reservations.stall_id,reservation_id,start_time, end_time, license_plate, total_cost, purchase_date, parking_lots.lot_name, parking_lots.lot_floor, parking_stalls.parking_type, parking_lot_address.street, parking_lot_address.city, parking_lot_address.province FROM reservations
        INNER JOIN parking_lots ON reservations.lot_id = parking_lots.lot_id
        INNER JOIN parking_stalls ON reservations.stall_id = parking_stalls.stall_id
        INNER JOIN parking_lot_address ON parking_lots.lot_id = parking_lot_address.lot_id
        WHERE reservation_id = ?
        `,
    [id],
  );
  console.log("in get_reservation", output);
  return output[0];
}

async function edit_reservation(
  license_plate: string,
  total_cost: number,
  start_time: string,
  end_time: string,
  lot_id: number,
  stall_id: number,
  reservation_id: string,
) {
  const [result] = await pool.query(
    `
      UPDATE reservations
      SET 
        license_plate = ?,
        total_cost = ?,
        start_time = ?,
        end_time = ?,
        lot_id = ?,
        stall_id = ?
      WHERE reservation_id = ?
        `,
    [
      license_plate,
      total_cost,
      start_time,
      end_time,
      lot_id,
      stall_id,
      reservation_id,
    ],
  );
}

async function create_reservation(
  license_plate: string,
  total_cost: number,
  start_time: string,
  end_time: string,
  lot_id: number,
  stall_id: number,
  customer_id: number,
) {
  const [result] = await pool.query(
    `INSERT INTO reservations (license_plate, total_cost, start_time, end_time, lot_id, stall_id, customer_id)
        VALUES(?, ?, ?,?, ?, ?, ?)`,
    [
      license_plate,
      total_cost,
      start_time,
      end_time,
      lot_id,
      stall_id,
      customer_id,
    ],
  );
}

async function get_stall_availability(id?: string) {
  if (id) {
    const [output] = await pool.query(
      `
      SELECT * FROM parking_stalls
      JOIN parking_lots ON parking_stalls.lot_id = parking_lots.lot_id
      WHERE occupied = 0 AND parking_lots.lot_id = ?
        `,
      [id],
    );
    return output;
  } else {
    const [output] = await pool.query(
      `
      SELECT * FROM parking_stalls
      JOIN parking_lots ON parking_stalls.lot_id = parking_lots.lot_id
      WHERE occupied = 0
        `,
    );
    return output;
  }
}

async function get_all_lots() {
  const [output] = await pool.query(
    `
      SELECT * FROM parking_lots
      JOIN parking_lot_schedules ON parking_lots.lot_id = parking_lot_schedules.lot_id
        `,
  );
  return output;
}

async function delete_reservation(id: string) {
  const [result] = await pool.query(
    `DELETE FROM reservations WHERE reservation_id = ?`,
    [id],
  );
}

export {
  get_reservations,
  get_reservation,
  edit_reservation,
  create_reservation,
  get_stall_availability,
  get_all_lots,
  delete_reservation,
};
