import * as db from "../models/reserveModel.js";

async function get_reservations(id: string) {
  const getAll = await db.get_reservations(id);
  return getAll;
}

async function get_reservation(id: string) {
  const getReserve = await db.get_reservation(id);
  return getReserve;
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
  const result = await db.create_reservation(
    license_plate,
    total_cost,
    start_time,
    end_time,
    lot_id,
    stall_id,
    customer_id,
  );
  return result;
}

async function get_stall_availability(id?: string) {
  if (id) {
    const result = await db.get_stall_availability(id);
    return result;
  } else {
    const result = await db.get_stall_availability();
    return result;
  }
}

async function get_all_lots() {
  const result = await db.get_all_lots();
  return result;
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
  const result = await db.edit_reservation(
    license_plate,
    total_cost,
    start_time,
    end_time,
    lot_id,
    stall_id,
    reservation_id,
  );
  return result;
}

async function delete_reservation(id: string) {
  const result = await db.delete_reservation(id);
  return result;
}

export {
  get_reservations,
  get_reservation,
  create_reservation,
  edit_reservation,
  get_stall_availability,
  get_all_lots,
  delete_reservation,
};
