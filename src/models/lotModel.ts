/**
 * @file Functions with SQL queries to fetch parking lot detials from parking_lot
 * column in the database.
 */

import { ParkingLot } from "../types/core";
import { pool } from "../../database/database";

/**
 * @func Gets all lots from the database and store them in an array.
 * @params None
 * @returns A promise with an array of type ParkingLot.
 */
async function fetchLotData(): Promise<any> {
  try {
    // Fetch all data needed from the 3 database tables
    const [rows] = await pool.query(`
    SELECT * FROM parking_lots l
    LEFT JOIN parking_lot_address a ON l.lot_id = a.lot_id
    LEFT JOIN parking_lot_schedules s ON l.lot_id = s.lot_id
    LEFT JOIN parking_lot_valid_permits v ON l.lot_id = v.lot_id
    `);

    return rows;
  } catch (err) {
    throw new Error(`An error occurred: ${err}`);
  }
}

/**
 * @func Gets all lots from the database and store them in map based on lot id
 * @params None
 * @returns A promise with map of unique parking lot objects
 */
export async function mapRowToParkingLot(): Promise<Map<number, ParkingLot>> {
  const uniqueLots: Map<number, ParkingLot> = new Map(); // map to store unique parking lots by id

  try {
    const rows = await fetchLotData();

    // Create a parking lot for each unique lot (by id) and add the unique lots to the map
    for (const lot of rows) {
      if (!uniqueLots.has(lot.lot_id)) {
        const newLot: ParkingLot = {
          lotId: lot.lot_id,
          name: lot.lot_name,
          floor: Number(lot.lot_floor),
          type: lot.lot_type,
          capacity: lot.lot_capacity,
          latitude: Number(Number(lot.lat).toFixed(2)),
          longitude: Number(Number(lot.lon).toFixed(2)),
          validPermits: [lot.valid_permits],
          description:
            lot.lot_description.charAt(0).toUpperCase() +
            lot.lot_description.slice(1),
          availability: null,
          openSpots: 0,
          address: {
            street: lot.street,
            city: lot.city,
            province: lot.province,
            postalCode: lot.postal_code,
          },
          schedule: {
            daytimePrice: Number(lot.daytimePrice),
            daytimeRate: Number(lot.daytimeRate),
            daytimeStartTime: lot.daytime_start_time.slice(0, 5),
            daytimeEndTime: lot.daytime_end_time.slice(0, 5),
            daytimeMaxPrice: Number(lot.daytimeMaxPrice),
            eveningPrice: Number(lot.eveningPrice),
            eveningRate: Number(lot.eveningRate),
            eveningStartTime: lot.evening_start_time.slice(0, 5),
            eveningEndTime: lot.evening_end_time.slice(0, 5),
            eveningMaxPrice: Number(lot.eveningMaxPrice),
            weekendPrice: Number(lot.weekendPrice),
            weekendRate: Number(lot.weekendRate),
            weekendStartTime: lot.weekend_start_time.slice(0, 5),
            weekendEndTime: lot.weekend_end_time,
            weekendMaxPrice: Number(lot.weekendMaxPrice),
            rateUnit: lot.rate_unit,
          },
        };

        uniqueLots.set(lot.lot_id, newLot);
      }
      // If this lot already exists in the map, just append the new valid permit to validPermits array
      else {
        const existingLot = uniqueLots.get(lot.lot_id) as ParkingLot;
        existingLot.validPermits.push(lot.valid_permits);
      }
    }
  } catch (err) {
    throw new Error(`An error occurred: ${err}`);
  }
  return uniqueLots;
}

/**
 * @func Gets number of occupied stalls for each parking lot.
 * @params An array of all the parking lots.
 * @returns A promise with a dictionary with the count of occupied stalls per lot.
 */
export async function getNumberOfOccupiedStalls(
  lots: ParkingLot[],
): Promise<any> {
  let rows;

  for (const lot of lots) {
    try {
      [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM parking_stalls 
       WHERE occupied = TRUE AND lot_id = ${lot.lotId}`,
      );
    } catch (err) {
      throw new Error(`An error occurred: ${err}`);
    }
  }
  return rows;
}
