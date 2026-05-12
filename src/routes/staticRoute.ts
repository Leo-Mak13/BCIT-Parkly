import express from "express";
import { authValidation } from "../middleware/authMiddleware";
const router = express.Router();

router.use(authValidation);

router.get("/permitsrates", async (req, res) => {
  res.render("permits-rates");
});

router.get("/helpsupport", async (req, res) => {
  res.render("help-support");
});

export default router;
