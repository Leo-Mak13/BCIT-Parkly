import express from "express";
import {
  goLoginPage,
  goSignupPage,
  createNewUserHandler,
} from "../controllers/userController";

const router = express.Router();

router.get("/signup", goSignupPage);

router.get("/login", goLoginPage);

router.post("/signup", createNewUserHandler);

export default router;
