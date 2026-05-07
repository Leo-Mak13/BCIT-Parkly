/**
 * @file Functions with SQL queries to fetch parking lot detials from parking_lot
 * column in the database.
 */

import { ParkingLot, Address } from "../types/core";
import { pool } from "../../database/database";

/**
 * @func Gets all lots from the database and store them in an array.
 * @params None
 * @returns A promise with an array of type ParkingLot.
 */
export async function fetchAllLots(): Promise<ParkingLot[]> {
  const lotsList: ParkingLot[] = [];

  try {
    // Fetch parking lot data from parking_lots table
    const [lotsInDB] = await pool.query("SELECT * FROM parking_lots");

    for (const lot of lotsInDB) {
      // Fetch address data from parking_lot_address table
      const [lotAddress] = await pool.query(
        `SELECT * FROM parking_lot_address WHERE lot_id = ${Number(lot.lot_id)}`,
      );

      // Fetch schedule data from parking_lot_schedules table
      const [lotSchedule] = await pool.query(
        `SELECT * FROM parking_lot_schedules WHERE lot_id = ${Number(lot.lot_id)}`,
      );

      // Fetch all valid permits from parking_lot_valid_permits table
      const [lotValidPermits] = await pool.query(
        `SELECT * FROM parking_lot_valid_permits WHERE lot_id = ${Number(lot.lot_id)}`,
      );

      // Create new parking lot type for each lot then append it to lotsList array
      const newLot: ParkingLot = {
        lotId: lot.lot_id,
        floor: Number(lot.lot_floor),
        type: lot.lot_type,
        capacity: lot.lot_capacity,
        latitude: Number(Number(lot.lat).toFixed(2)),
        longitude: Number(Number(lot.lon).toFixed(2)),
        validPermits: lotValidPermits.map((vp: any) => vp.valid_permits),
        description:
          lot.lot_description.charAt(0).toUpperCase() +
          lot.lot_description.slice(1),

        address: {
          street: lotAddress.map((a: any) => a.street)[0],
          city: lotAddress.map((a: any) => a.city)[0],
          province: lotAddress.map((a: any) => a.province)[0],
          postalCode: lotAddress.map((a: any) => a.postal_code)[0],
        },

        schedule: {
          daytimePrice: lotSchedule.map((s: any) => Number(s.daytimePrice))[0],
          daytimeRate: lotSchedule.map((s: any) => Number(s.daytimeRate))[0],
          daytimeTime: lotSchedule.map((s: any) => s.daytimeTime)[0],
          daytimeMaxPrice: lotSchedule.map((s: any) =>
            Number(s.daytimeMaxPrice),
          )[0],
          eveningPrice: lotSchedule.map((s: any) => Number(s.eveningPrice))[0],
          eveningRate: lotSchedule.map((s: any) => Number(s.eveningRate))[0],
          eveningTime: lotSchedule.map((s: any) => s.eveningTime)[0],
          eveningMaxPrice: lotSchedule.map((s: any) =>
            Number(s.eveningMaxPrice),
          )[0],
          weekendPrice: lotSchedule.map((s: any) => Number(s.weekendPrice))[0],
          weekendRate: lotSchedule.map((s: any) => Number(s.weekendRate))[0],
          weekendTime: lotSchedule.map((s: any) => s.weekendTime)[0],
          weekendMaxPrice: lotSchedule.map((s: any) =>
            Number(s.weekendMaxPrice),
          )[0],
          rateUnit: lotSchedule.map((s: any) => s.rate_unit)[0],
        },
      };

      lotsList.push(newLot);
      // console.log(lotsList);
    }
  } catch (err) {
    throw new Error(`An error occurred: ${err}`);
  }
  return lotsList;
}
