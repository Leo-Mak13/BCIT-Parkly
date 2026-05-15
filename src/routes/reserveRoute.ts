import express from "express";
import * as database from "../controllers/reserveController.js";
import { authValidation } from "../middleware/authMiddleware";

const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/:customer_id", async (req, res) => {
  const reservations = await database.get_reservations(req.params.customer_id);
  res.render("myReservations", { reservations });
});

router.get("/view/:reservation_id", async (req, res) => {
  const reservation = await database.get_reservation(req.params.reservation_id);
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
