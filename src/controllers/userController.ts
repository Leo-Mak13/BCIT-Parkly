import express from "express";
import { Request, Response } from "express";
import { PasswordMismatchError } from "../middleware/errorTypes";
const devMode = process.env.MODE == "dev";

export function goLoginPage(req: Request, res: Response) {
  res.render("login");
}

export function goSignupPage(req: Request, res: Response) {
  res.render("signup", { message: null, devMode });
}

export function createUser(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    firstGoPassword,
    secondGoPassword,
  } = req.body;
  try {
    console.log(
      firstName,
      lastName,
      email,
      phoneNumber,
      firstGoPassword,
      secondGoPassword,
    );
    res.render("signup");
  } catch (error: any) {
    if (error instanceof PasswordMismatchError) {
      return res.render("signup", { error: "Passwords must match!" });
    }
    res
      .status(500)
      .render("signup", { message: "Server error - please try again" });
  }
}
