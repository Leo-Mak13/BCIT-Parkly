import express from "express";
import * as database from "../controllers/reserveController.js";
const router = express.Router();

router.get("/:customer_id", async (req, res) => {
  const reservations = await database.get_reservations(req.params.customer_id);
  res.render("myReservations", { reservations });
});

router.get("/view/:reservation_id", async (req, res) => {
  const reservation = [database.get_reservation(req.params.reservation_id)];
  res.render("singleReservation", { reservation });
});

// router.get("/edit/:reservation_id", (req, res) => {
//   //TODO ⭐
//   //get information abut the specifc reservation
// });
// router.post("/edit/:reservation_id", (req, res) => {
//   //TODO ⭐
//   //make changes to that information
// });

// router.get("/create", (req, res) => {
//   res.render("createReservation");
// });

// router.post("/create");

// // NOTE ⭐
// // may not need this later.
// router.get("/delete/:reservation_id", (req, res) => {
//   //TODO ⭐
//   //get info about the info
// });
// router.post("/delete/:reservation_id", (req, res) => {
//   //TODO ⭐
//   //
// });

export default router;
