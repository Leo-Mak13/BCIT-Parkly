import * as db from "../../database/database.js";

function get_reservations(id: string) {
  return db.get_reservations(id);
}

function get_reservation(id: string) {
  return db.get_reservation(id);
}

export { get_reservations, get_reservation };
