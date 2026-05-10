import express from "express";
import {
  goLoginPage,
  goSignupPage,
  createUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/signup", goSignupPage);

router.get("/login", goLoginPage);

router.post("/signup", createUser);

export default router;
