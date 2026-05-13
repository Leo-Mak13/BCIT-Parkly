import express from "express";
import * as database from "../controllers/reserveController.js";
import { authValidation } from "../middleware/authMiddleware";

const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/:customer_id", async (req, res) => {
  try {
    const reservations = await database.get_reservations(req.user.id);
    res.render("myReservations", { reservations });
  } catch (err) {
    res.status(404).render("");
  }
});

router.get("/view/:reservation_id", async (req, res) => {
  try {
    const reservation = await database.get_reservation(
      parseInt(req.params.reservation_id),
    );
    res.render("singleReservation", { reservation });
  } catch (err) {
    res.status(404).render("");
  }
});

router.get("/edit/:reservation_id", async (req, res) => {
  //TODO ⭐
  //get information abut the specifc reservation
  const editReservation = await database.get_reservation(
    parseInt(req.params.reservation_id),
  );
  res.render("editReservationPage", { editReservation });
});
router.post("/edit/:reservation_id", async (req, res) => {
  //TODO ⭐
  //make changes to that information
  const changes = await database.edit_reservation(
    req.body.license_plate,
    req.body.total_cost,
    req.body.stall_location,
    req.body.lot_id,
    req.body.stall_id,
    req.params.reservation_id,
  );
  res.redirect(`/reservations/view/${req.params.reservation_id}`);
});

router.get("/create/:customer_id", async (req, res) => {
  res.render("createReservation");
});

router.post("/create/:customer_id", async (req, res) => {
  const create = await database.create_reservation(
    req.body.license_plate,
    req.body.total_cost,
    req.body.stall_location,
    req.body.lot_id,
    req.body.stall_id,
    parseInt(req.params.customer_id),
  );
  res.redirect(`/reservations/${req.params.customer_id}`);
});

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
