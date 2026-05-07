import { fetchAllLots } from "../models/lotModel";
import { ParkingLot } from "../types/core";

/**
 * @func Gets all lots from the models.
 * @params None
 * @returns A promise with a list of all parking lots around DTC.
 */
export async function getAllLots(): Promise<ParkingLot[]> {
  // ❗❗❗ BUSINESS LOGIC WILL BE DONE HERE LATER ❗❗❗
  return await fetchAllLots();
}
