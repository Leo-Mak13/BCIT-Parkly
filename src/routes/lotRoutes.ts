import { Router } from "express";
import { getHomePage } from "../controllers/lotController";
import { authValidation } from "../middleware/authMiddleware";

const router = Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/", getHomePage); // when user visits the homepage

export default router;
