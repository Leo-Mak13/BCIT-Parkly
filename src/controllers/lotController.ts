import { getLotAvailability } from "../services/lotService";
import { Request, Response } from "express";

/**
 * @func Renders the homepage
 * @params req, res
 * @returns An empty promise
 */
export async function getHomePage(req: Request, res: Response): Promise<void> {
  try {
    const allLots = await getLotAvailability();
    res.render("main", { parkingLots: allLots });
  } catch (err) {
    res
      .status(500)
      .send(
        "Something went wrong! Couldn't get parking lot data from the database.",
      );
  }
}
