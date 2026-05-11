import express from "express";
const router = express.Router();

router.get("/permitsrates", async (req, res) => {
  res.render("permits-rates");
});

router.get("/helpsupport", async (req, res) => {
  res.render("help-support");
});

export default router;