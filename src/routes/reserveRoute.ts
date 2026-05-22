import express from "express";
import {
  viewAll,
  viewOne,
  createPage,
  createReservation,
  editPage,
  editReservation,
  deleteReservation,
} from "../controllers/reserveController.js";
import { authValidation } from "../middleware/authMiddleware";

const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/", viewAll);

router.post("/delete/:reservation_id", deleteReservation);

router.get("/view/:reservation_id", viewOne);

router.get("/create", createPage);

router.post("/create", createReservation);

router.get("/edit/:reservation_id", editPage);

router.post("/edit/:reservation_id", editReservation);

export default router;
