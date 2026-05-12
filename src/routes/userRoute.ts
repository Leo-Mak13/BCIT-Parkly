import express from "express";
import {
  goLoginPage,
  goSignupPage,
  createNewUserHandler,
  loginUser,
  testRender,
} from "../controllers/userController";
import { authValidation } from "../middleware/authMiddleware";

const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

router.get("/signup", goSignupPage);

router.get("/login", goLoginPage);

router.post("/signup", createNewUserHandler);

router.post("/login", loginUser);

router.get("/test", testRender);

export default router;
