import express from "express";
import { authValidation } from "../middleware/authMiddleware";
import {
  permitRatesHandler,
  helpSupportHandler,
} from "../controllers/staticController";
const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/permits", permitRatesHandler);

router.get("/help", helpSupportHandler);

export default router;
