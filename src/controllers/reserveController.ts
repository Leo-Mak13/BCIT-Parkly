import {
  get_reservations,
  get_reservation,
  create_reservation,
  edit_reservation,
  get_stall_availability,
  get_all_lots,
} from "../services/reserveService.js";
import express from "express";
import { Request, Response } from "express";
import { error } from "node:console";
import { get } from "node:http";
import { delete_reservation } from "../models/reserveModel.js";
const devMode = process.env.MODE == "dev";

async function viewAll(req: Request, res: Response) {
  try {
    if (req.user === null) {
      res.render("myReservations", {
        error: "Error Log in to see reservations",
        reservation: [],
      });
    } else {
      const UID = req.user.id;
      const reservations = await get_reservations(UID);
      res.render("myReservations", {
        devMode,
        reservations,
        user: req.user,
        error: null,
      });
    }
  } catch (err) {
    res.status(500).render("myReservations", {
      error: err,
      user: req.user,
      reservations: [],
    });
  }
}

async function viewOne(req: Request, res: Response) {
  try {
    const reservationID = req.params.reservation_id;
    const reservation = await get_reservation(reservationID);
    res.render("singleReservation", {
      devMode,
      reservation,
      user: req.user,
      error: null,
    });
  } catch (err) {
    res.status(500).render("singleReservation", {
      error: err,
      user: req.user,
      reservation: [],
    });
  }
}

async function createPage(req: Request, res: Response) {
  try {
    const lots = await get_all_lots();
    const stalls = await get_stall_availability();
    res.render("newReservation", {
      devMode,
      lots,
      stalls,
      user: req.user,
      error: null,
    });
  } catch (err) {
    res.status(500).render("newReservation", {
      devMode,
      lots: [],
      stalls: [],
      error: err,
      user: req.user,
    });
  }
}

async function createReservation(req: Request, res: Response) {
  try {
    const {
      license_plate,
      total_cost,
      start_time,
      end_time,
      lot_id,
      stall_id,
    } = req.body;
    const UID = await req.user.id;
    const create = await create_reservation(
      license_plate,
      total_cost,
      start_time,
      end_time,
      lot_id,
      stall_id,
      UID,
    );
    res.redirect(`/reserve/reservations/`);
  } catch (err) {
    res.status(500).render("myReservations", {
      error: err,
      user: req.user,
      reservations: [],
    });
  }
}

async function editPage(req: Request, res: Response) {
  try {
    const lots = await get_all_lots();
    const stalls = await get_stall_availability();
    const reserveID = (await req.params.reservation_id) as string;
    console.log(reserveID);
    const toEdit = await get_reservation(reserveID);
    console.log(toEdit);
    res.render("editReservationPage", {
      devMode,
      toEdit,
      lots,
      stalls,
      user: req.user,
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("editReservationPage", {
      error: err,
      user: req.user,
      lots: [],
      stalls: [],
      devMode,
      toEdit: [],
    });
  }
}

async function editReservation(req: Request, res: Response) {
  const { license_plate, total_cost, start_time, end_time, lot_id, stall_id } =
    req.body;
  try {
    const reservationID = (await req.params.reservation_id) as string;
    console.log(reservationID);
    const edit = await edit_reservation(
      license_plate,
      total_cost,
      start_time,
      end_time,
      lot_id,
      stall_id,
      reservationID,
    );
    res.redirect(`/reserve/reservations/view/${reservationID}`);
  } catch (err) {
    res.status(500).render("editReservationPage", {
      error: err,
      user: req.user,
      toEdit: [],
    });
  }
}

async function deleteReservation(req: Request, res: Response) {
  try {
    const reservationID = req.params.reservation_id as string;
    console.log(reservationID);
    const remove = await delete_reservation(reservationID);
    res.redirect("/reserve/reservations/");
  } catch (err) {
    res.status(500).render("myReservations", {
      reservations: [],
      user: req.user,
      error: err,
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
  deleteReservation,
};
