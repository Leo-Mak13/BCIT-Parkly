import { Router } from "express";
import { getHomePage } from "../controllers/lotController";

const router = Router();

router.get("/", getHomePage); // when user visits the homepage

export default router;
