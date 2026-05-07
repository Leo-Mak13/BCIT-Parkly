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
export async function fetchAllLots(): Promise<ParkingLot[]> {
  const lotsList: ParkingLot[] = [];

  try {
    // Fetch parking lot data from parking_lots table
    const [lotsInDB] = await pool.query("SELECT * FROM parking_lots");

    for (const lot of lotsInDB) {
      // Fetch address data from parking_lot_address table
      const [addressRows] = await pool.query(
        `SELECT * FROM parking_lot_address WHERE lot_id = ${Number(lot.lot_id)}`,
      );

      // Fetch schedule data from parking_lot_schedules table
      const [scheduleRows] = await pool.query(
        `SELECT * FROM parking_lot_schedules WHERE lot_id = ${Number(lot.lot_id)}`,
      );

      // Fetch all valid permits from parking_lot_valid_permits table
      const [validPermitsRows] = await pool.query(
        `SELECT * FROM parking_lot_valid_permits WHERE lot_id = ${Number(lot.lot_id)}`,
      );

      // Create new parking lot type for each lot then append it to lotsList array
      const newLot: ParkingLot = {
        lotId: lot.lot_id,
        name: lot.lot_name,
        floor: Number(lot.lot_floor),
        type: lot.lot_type,
        capacity: lot.lot_capacity,
        latitude: Number(Number(lot.lat).toFixed(2)),
        longitude: Number(Number(lot.lon).toFixed(2)),
        validPermits: validPermitsRows.map((vp: any) => vp.valid_permits),
        description:
          lot.lot_description.charAt(0).toUpperCase() +
          lot.lot_description.slice(1),
        availability: null,
        openSpots: 0,

        address: {
          street: addressRows.map((a: any) => a.street)[0],
          city: addressRows.map((a: any) => a.city)[0],
          province: addressRows.map((a: any) => a.province)[0],
          postalCode: addressRows.map((a: any) => a.postal_code)[0],
        },

        schedule: {
          daytimePrice: scheduleRows.map((s: any) => Number(s.daytimePrice))[0],
          daytimeRate: scheduleRows.map((s: any) => Number(s.daytimeRate))[0],
          daytimeStartTime: scheduleRows.map((s: any) => s.daytimeStartTime)[0],
          daytimeEndTime: scheduleRows.map((s: any) => s.daytimeEndTime)[0],
          daytimeMaxPrice: scheduleRows.map((s: any) =>
            Number(s.daytimeMaxPrice),
          )[0],
          eveningPrice: scheduleRows.map((s: any) => Number(s.eveningPrice))[0],
          eveningRate: scheduleRows.map((s: any) => Number(s.eveningRate))[0],
          eveningStartTime: scheduleRows.map((s: any) => s.eveningStartTime)[0],
          eveningEndTime: scheduleRows.map((s: any) => s.eveningEndTime)[0],
          eveningMaxPrice: scheduleRows.map((s: any) =>
            Number(s.eveningMaxPrice),
          )[0],
          weekendPrice: scheduleRows.map((s: any) => Number(s.weekendPrice))[0],
          weekendRate: scheduleRows.map((s: any) => Number(s.weekendRate))[0],
          weekendStartTime: scheduleRows.map((s: any) => s.weekendStartTime)[0],
          weekendEndTime: scheduleRows.map((s: any) => s.weekendEndTime)[0],
          weekendMaxPrice: scheduleRows.map((s: any) =>
            Number(s.weekendMaxPrice),
          )[0],
          rateUnit: scheduleRows.map((s: any) => s.rate_unit)[0],
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
