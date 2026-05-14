import {
  get_reservations,
  get_reservation,
  create_reservation,
  edit_reservation,
} from "../services/reserveService.js";
import express from "express";
import { Request, Response } from "express";
import { error } from "node:console";
const devMode = process.env.MODE == "dev";

async function viewAll(req: Request, res: Response) {
  try {
    const UID = req.user.id;
    const reservations = await get_reservations(UID);
    res.render("myReservations", { devMode, reservations, user: req.user });
  } catch (err) {
    res.status(500).render("myReservations", {
      error: "server error - unable to find your Reservations",
      user: req.user,
    });
  }
}

async function viewOne(req: Request, res: Response) {
  try {
    const reservationID = req.params.reservation_id;
    const reservation = await get_reservation(reservationID);
    res.render("singleReservation", { devMode, reservation, user: req.user });
  } catch (err) {
    res.status(500).render("singleReservation", {
      error: "server error - unable to find your Reservation",
      user: req.user,
    });
  }
}

async function createPage(req: Request, res: Response) {
  try {
    res.render("newReservation");
  } catch (err) {
    res.status(500).render("newReservation", {
      error:
        "server error - unable to create a reservation at this time. Try again later.",
      user: req.user,
    });
  }
}

async function createReservation(req: Request, res: Response) {
  try {
    const { license_plate, total_cost, stall_location, lot_id, stall_id } =
      req.body;
    const UID = req.user.id;
    const create = await create_reservation(
      license_plate,
      total_cost,
      stall_location,
      lot_id,
      stall_id,
      UID,
    );
    res.redirect(`/reservations/${UID}`);
  } catch (err) {
    res.status(500).render("myReservation", {
      error: "server error - unable to reserve that spot",
      user: req.user,
    });
  }
}

async function editPage(req: Request, res: Response) {
  try {
    const reserveID = req.params.reservation_id;
    const toEdit = await get_reservation(reserveID);
    res.render("editReservationPage");
  } catch (err) {
    res.status(500).render("editReservationPage", {
      error: "server error - cant edit the current reservation",
      user: req.user,
    });
  }
}

async function editReservation(req: Request, res: Response) {
  try {
    const reservationID = req.params.reservation_id;
    const { license_plate, total_cost, stall_location, lot_id, stall_id } =
      req.body;
    const edit = await edit_reservation(
      license_plate,
      total_cost,
      stall_location,
      lot_id,
      stall_id,
      reservationID,
    );
    res.redirect(`/reservation/${reservationID}`);
  } catch (err) {
    res.status(500).render("editReservationPage", {
      error: "server error - cant edit the current reservation",
      user: req.user,
    });
  }
}

export {
  viewAll,
  viewOne,
  createPage,
  createReservation,
  editPage,
  editReservation,
};
