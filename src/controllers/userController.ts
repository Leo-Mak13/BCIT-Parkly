import express from "express";
import { Request, Response } from "express";
import { PasswordMismatchError } from "../middleware/errorTypes";
import { createCustomer } from "../services/userService";
const devMode = process.env.MODE == "dev";

export function goLoginPage(req: Request, res: Response) {
  res.render("login");
}

export function goSignupPage(req: Request, res: Response) {
  res.render("signup", { message: null, devMode });
}

export function createNewUserHandler(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    firstGoPassword,
    secondGoPassword,
    role,
  } = req.body;
  try {
    console.log(
      firstName,
      lastName,
      email,
      phoneNumber,
      firstGoPassword,
      secondGoPassword,
      role,
    );
    const customer = createCustomer(
      firstName,
      lastName,
      email,
      phoneNumber,
      firstGoPassword,
      secondGoPassword,
      role,
    );
    res.render("signup", { customer, devMode });
  } catch (error: any) {
    if (error instanceof PasswordMismatchError) {
      return res.render("signup", { error: "Passwords must match!", devMode });
    }
    res.status(500).render("signup", {
      message: "Server error - please try again",
      devMode,
    });
  }
}
