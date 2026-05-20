import express from "express";
import {
  goLoginPage,
  goSignupPage,
  createNewUserHandler,
  loginUser,
  testRender,
  logOutUser,
  homePage,
  confirmationPage,
} from "../controllers/userController";
import { authValidation } from "../middleware/authMiddleware";

const router = express.Router();

// for every route, use the validator - if valid, ie. user has a valid pre-existing session, you now have access to req.user.id and req.user.email (corresponds to users table in database - use this for joins)
router.use(authValidation);

// get signup page
router.get("/signup", goSignupPage);

// get login page
router.get("/login", goLoginPage);

// post our signup to server - create new user
router.post("/signup", createNewUserHandler);

// post a login attempt
router.post("/login", loginUser);

// testing page for checking req.user
router.get("/test", testRender);

// receive logout request by clicking the button
router.get("/logout", logOutUser);

// get homepage
router.get("/", homePage);

router.get("/confirmation", confirmationPage);

export default router;
