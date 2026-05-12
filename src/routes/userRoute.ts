import express from "express";
import {
  goLoginPage,
  goSignupPage,
  createNewUserHandler,
  loginUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/signup", goSignupPage);

router.get("/login", goLoginPage);

router.post("/signup", createNewUserHandler);

router.post("/login", loginUser);

export default router;
