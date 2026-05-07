import { fetchAllLots } from "../models/lotModel";
import { ParkingLot } from "../types/core";
import { pool } from "../../database/database";

/**
 * @func
 * @params
 * @returns
 */
async function getLotAvailability(pLots: ParkingLot[]): Promise<ParkingLot[]> {
  for (const lot of pLots) {
    // Get number of stalls that are occupied per lot
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM parking_stalls 
       WHERE occupied = TRUE AND lot_id = ${lot.lotId}`,
    );

    const occupiedSpots = rows[0].count;
    const availableSpots = lot.capacity - occupiedSpots;

    // Check lot availability based on number of occupied spots
    if (availableSpots == 0) {
      lot.availability = "full";
    } else if (availableSpots <= 0.15 * lot.capacity) {
      lot.availability = "limited";
    } else {
      lot.availability = "available";
    }

    lot.openSpots = availableSpots;
  }

  return pLots;
}

/**
 * @func
 * @params
 * @returns
 */
export async function getAllLotsWithAvail(): Promise<ParkingLot[]> {
  const lots = await fetchAllLots();
  const calculatedAvail = await getLotAvailability(lots);
  return calculatedAvail;
}
