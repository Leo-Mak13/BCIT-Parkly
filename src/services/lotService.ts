import {
  mapRowToParkingLot,
  getNumberOfOccupiedStalls,
} from "../models/lotModel";
import { ParkingLot } from "../types/core";

/**
 * @func Gets availability and number of open spots for each parking lot
 * @params Array of ParkingLot data types
 * @returns A promise with an array of parking lots with the calculated availability and openSpots attributes
 */
export async function getLotAvailability(): Promise<ParkingLot[]> {
  const lotsMap = await mapRowToParkingLot();
  const lotsArray = Array.from(lotsMap.values()); // convert map values to an array
  const occupancyRows = await getNumberOfOccupiedStalls(); // get number of stalls that are occupied per lot

  for (const lot of lotsArray) {
    const occupancy = occupancyRows.find((r: any) => r.lot_id === lot.lotId);

    let occupiedCount = 0;
    if (occupancy) {
      occupiedCount = occupancy.occupied;
    }

    const availableSpots = lot.capacity - occupiedCount;

    // Check lot availability based on number of available spots
    if (availableSpots == 0) {
      lot.availability = "Full";
    } else if (availableSpots <= 0.15 * lot.capacity) {
      lot.availability = "Limited";
    } else {
      lot.availability = "Available";
    }

    lot.openSpots = availableSpots;
  }

  return lotsArray;
}
