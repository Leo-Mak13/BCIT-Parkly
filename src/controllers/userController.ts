import express from "express";
import { Request, Response } from "express";
import { PasswordMismatchError } from "../middleware/errorTypes";
import {
  createCustomer,
  getUserIdByEmail,
  logOutDeleteSession,
  validateUser,
} from "../services/userService";
import { EOL } from "os";
import { createSession } from "../services/authService";
const devMode = process.env.MODE == "dev";

export function homePage(req: Request, res: Response) {
  res.render("/", { devMode, error: null, user: req.user });
}

export function goLoginPage(req: Request, res: Response) {
  res.render("login", { devMode, error: null, user: req.user });
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
    user: req.user,
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
    res.render("confirmationSignUp", {
      confirmedEmail: email,
      devMode,
      user: req.user,
    });
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
        user: req.user,
      });
    }
    res.status(500).render("signup", {
      message: "Server error - please try again",
      devMode,
      user: req.user,
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
        user: req.user,
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
      res.redirect("");
    }
  } catch (err) {
    res.status(500).render("login", {
      error: "Server error - please try again",
      devMode,
      user: req.user,
    });
  }
}

export async function testRender(req: Request, res: Response) {
  res.render("test", { user: req.user });
}

export async function logOutUser(req: Request, res: Response) {
  try {
    if (req.user === null) {
      res.redirect("/login");
    } else {
      const userId = req.user.id;
      await logOutDeleteSession(userId);
      console.log("before resetting req.user", req.user);
      req.user = null;
      console.log("after resetting req.user", req.user);
      res.render("main", { devMode, error: null, user: req.user });
    }
  } catch (err) {
    res.status(500).render("login", {
      error: "Server error - please try again",
      devMode,
      user: req.user,
    });
  }
}
