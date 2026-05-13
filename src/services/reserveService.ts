import * as db from "../models/reserveModel";

async function get_reservations(id: number) {
  return await db.get_reservations(id);
}

async function get_reservation(id: number) {
  return await db.get_reservation(id);
}

async function create_reservation(
  license_plate: string,
  total_cost: number,
  stall_location: string,
  lot_id: number,
  stall_id: number,
  customer_id: number,
) {
  return await db.create_reservation(
    license_plate,
    total_cost,
    stall_location,
    lot_id,
    stall_id,
    customer_id,
  );
}

async function edit_reservation(
  license_plate: string,
  total_cost: number,
  stall_location: string,
  lot_id: string,
  stall_id: number,
  reservation_id: string,
) {
  return await db.edit_reservation(
    license_plate,
    total_cost,
    stall_location,
    lot_id,
    stall_id,
    reservation_id,
  );
}

export {
  get_reservations,
  get_reservation,
  create_reservation,
  edit_reservation,
};
