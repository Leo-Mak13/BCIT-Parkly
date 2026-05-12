import express from "express";
import { Request, Response } from "express";
import { PasswordMismatchError } from "../middleware/errorTypes";
import { createCustomer, validateUser } from "../services/userService";
import { EOL } from "os";
const devMode = process.env.MODE == "dev";

export function goLoginPage(req: Request, res: Response) {
  res.render("login", { devMode, error: null });
}

export function goSignupPage(req: Request, res: Response) {
  res.render("signup", {
    message: null,
    devMode,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
}

export async function createNewUserHandler(req: Request, res: Response) {
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
    const customer = await createCustomer(
      firstName,
      lastName,
      email,
      phoneNumber,
      firstGoPassword,
      secondGoPassword,
      role,
    );
    res.render("confirmationSignUp", { confirmedEmail: email, devMode });
  } catch (error: any) {
    if (error instanceof PasswordMismatchError) {
      return res.render("signup", {
        message: "Passwords must match!",
        devMode,
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
      });
    }
    res.status(500).render("signup", {
      message: "Server error - please try again",
      devMode,
    });
  }
}
// IMPLEMENT UX MODE AFTER DEV MODE DISABLED

export async function loginUser(req: Request, res: Response) {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  const result = await validateUser(email, plainTextPassword);
  res.render("login", { devMode, error: null });
}
