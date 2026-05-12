import express from "express";
import { authValidation } from "../middleware/authMiddleware";
const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/permitsrates", async (req, res) => {
  res.render("permits-rates");
});

router.get("/helpsupport", async (req, res) => {
  res.render("help-support");
});

export default router;
