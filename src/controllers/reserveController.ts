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

async function viewAll(req: Request, res: Response) {
  try {
    if (req.user === null) {
      res.render("myReservations", {
        error: "Error Log in to see reservations",
        reservations: [],
        user: req.user,
      });
    } else {
      const UID = req.user.id;
      const reservations = await get_reservations(UID);
      res.render("myReservations", {
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
    const reservations = await get_reservation(reservationID);
    res.render("singleReservation", {
      reservation: [reservations],
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
      lots,
      stalls,
      user: req.user,
      error: null,
    });
  } catch (err) {
    res.status(500).render("newReservation", {
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
      date_reserved,
      license_plate,
      start_time,
      end_time,
      lot_id,
      stall_id,
    } = req.body;

    const lotRates = await get_all_lots();
    const lot = lotRates.find((l) => l.lot_id == parseInt(lot_id));

    const parseStart = `${date_reserved} ${start_time}:00`;
    const parseEnd = `${date_reserved} ${end_time}:00`;

    const end = new Date(`${date_reserved}T${end_time}`);
    const start = new Date(`${date_reserved}T${start_time}`);

    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const weekEnds = start.getDay() === 0 || end.getDay() === 6;

    let rate = 0,
      max = 0;
    if (weekEnds === true) {
      rate = parseFloat(lot.weekendPrice);
      max = parseFloat(lot.weekendMaxPrice);
    } else if (
      start >= lot.daytime_start_time &&
      start < lot.daytime_end_time
    ) {
      rate = parseFloat(lot.daytimePrice);
      max = parseFloat(lot.daytimeMaxPrice);
    } else {
      rate = parseFloat(lot.eveningPrice);
      max = parseFloat(lot.eveningMaxPrice);
    }

    const total_cost = Math.min(diffHours * rate, max);

    const UID = await req.user.id;
    const create = await create_reservation(
      license_plate,
      total_cost,
      parseStart,
      parseEnd,
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

      toEdit: [],
    });
  }
}

async function editReservation(req: Request, res: Response) {
  try {
    const {
      date_reserved,
      license_plate,
      start_time,
      end_time,
      lot_id,
      stall_id,
    } = req.body;
    const reservationID = (await req.params.reservation_id) as string;

    const lotRates = await get_all_lots();
    const lot = lotRates.find((l) => l.lot_id == parseInt(lot_id));

    const parseStart = `${date_reserved} ${start_time}:00`;
    const parseEnd = `${date_reserved} ${end_time}:00`;

    const end = new Date(`${date_reserved}T${end_time}`);
    const start = new Date(`${date_reserved}T${start_time}`);

    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const weekEnds = start.getDay() === 0 || end.getDay() === 6;

    let rate = 0,
      max = 0;
    if (weekEnds === true) {
      rate = parseFloat(lot.weekendPrice);
      max = parseFloat(lot.weekendMaxPrice);
    } else if (
      start >= lot.daytime_start_time &&
      start < lot.daytime_end_time
    ) {
      rate = parseFloat(lot.daytimePrice);
      max = parseFloat(lot.daytimeMaxPrice);
    } else {
      rate = parseFloat(lot.eveningPrice);
      max = parseFloat(lot.eveningMaxPrice);
    }

    const total_cost = Math.min(diffHours * rate, max);

    const edit = await edit_reservation(
      license_plate,
      total_cost,
      parseStart,
      parseEnd,
      lot_id,
      stall_id,
      reservationID,
    );
    res.redirect(`/reserve/reservations/view/${reservationID}`);
  } catch (err) {
    res.status(500).render("sigleReservation", {
      error: err,
      user: req.user,
      reservation: [],
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
