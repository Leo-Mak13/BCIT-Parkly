import express from "express";
import { Request, Response } from "express";
import { PasswordMismatchError } from "../middleware/errorTypes";
import {
  createCustomer,
  getUserIdByEmail,
  validateUser,
} from "../services/userService";
import { EOL } from "os";
import { createSession } from "../services/authService";
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

/*
 * @func login the user
 * @params request or response
 * @ returns nothing
 * login the user via incoming req.body.email | password - if successful, create a cookie named "auth_session" that contains the string tokenOnly (the token needed to lookup session in database)
 */
export async function loginUser(req: Request, res: Response) {
  try {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    const result = await validateUser(email, plainTextPassword);
    if (!result) {
      res.render("login", {
        devMode,
        error: "Incorrect email and/or password",
      });
    } else {
      const user_id = await getUserIdByEmail(email);
      const sessionToken = await createSession(user_id);
      const tokenOnly = sessionToken.token;
      res.cookie("auth_session", tokenOnly, {
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.redirect("myReservations");
    }
  } catch (err) {
    res.status(500).render("login", {
      error: "Server error - please try again",
      devMode,
    });
  }
}
