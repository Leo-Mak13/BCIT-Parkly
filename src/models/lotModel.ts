/**
 * @file Functions with SQL queries to fetch parking lot detials from parking_lot
 * column in the database.
 */

import { ParkingLot } from "../types/core";
import { pool } from "../../database/database";

// Get all lots from the database and store them in an array
async function fetchAllLots(): Promise<ParkingLot[]> {
  const lotsList: ParkingLot[] = [];

  try {
    const [lotsInDB] = await pool.query("SELECT * FROM parking_lots");
    console.log(lotsInDB);

    for (const lot of lotsInDB) {
      const newLot: ParkingLot = {
        lotId: lot.lot_id,
        floor: lot.lot_floor,
        type: lot.lot_type,
        capacity: lot.lot_capacity,
        schedule: lot.schedule,
        latitude: lot.lat,
        longitude: lot.lon,
        validPermits: lot.valid_permits,
        description: lot.lot_description,
      };

      lotsList.push(newLot);
      console.log(lotsList);
    }
  } catch (err) {
    throw new Error();
  }

  return lotsList;
}

fetchAllLots();
