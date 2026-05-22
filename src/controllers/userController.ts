import express from "express";
import { Request, Response } from "express";
import {
  EmailInUseError,
  IncorrectEmailPasswordError,
  PasswordMismatchError,
} from "../middleware/errorTypes";
import {
  createNewCustomerUser,
  getUserIdByEmail,
  logOutDeleteSession,
  validateEmailNotUsed,
  validateUser,
} from "../services/userService";
import { EOL } from "os";
import { createSession } from "../services/authService";
const devMode = process.env.MODE == "dev";

export function homePage(req: Request, res: Response) {
  res.render("main", { devMode, error: null, user: req.user });
}

export function goLoginPage(req: Request, res: Response) {
  res.render("login", { devMode, error: null, user: req.user, email: "" });
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

/**
 * @func createNewUserHandler handler function for signup/registration
 * @param req
 * @param res
 *
 */
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
    const checkEmail = await validateEmailNotUsed(email);
    const customer = await createNewCustomerUser(
      firstName,
      lastName,
      email,
      phoneNumber,
      firstGoPassword,
      secondGoPassword,
      role,
    );
    res.redirect(`/users/confirmation?user=${email}`);
  } catch (error: any) {
    console.log(error);
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
    } else if (error instanceof EmailInUseError) {
      return res.render("signup", {
        message: "Email already in use!",
        devMode,
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        user: req.user,
      });
    }
    console.log(error);
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
  const email = req.body.email;
  try {
    const plainTextPassword = req.body.password;
    const result = await validateUser(email, plainTextPassword);
    const user_id = await getUserIdByEmail(email);
    const sessionToken = await createSession(user_id);
    const tokenOnly = sessionToken.token;
    res.cookie("auth_session", tokenOnly, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("/reserve/reservations");
  } catch (error: any) {
    if (error instanceof IncorrectEmailPasswordError) {
      res.render("login", {
        error: "Wrong password or email - please try again",
        email,
        devMode,
        user: req.user,
      });
    } else {
      res.status(500).render("login", {
        error: "Server error - please try again",
        devMode,
        user: req.user,
      });
    }
  }
}

export async function testRender(req: Request, res: Response) {
  res.redirect("test");
}

export async function logOutUser(req: Request, res: Response) {
  try {
    if (req.user === null) {
      res.render("login", {
        devMode,
        error: "User not found - please login again",
        user: req.user,
      });
    } else {
      const userId = req.user.id;
      await logOutDeleteSession(userId);
      req.user = null;
      res.redirect("/users/login");
    }
  } catch (err) {
    res.status(500).render("login", {
      error: "Server error - please try again",
      devMode,
      user: req.user,
    });
  }
}

export async function confirmationPage(req: Request, res: Response) {
  try {
    const newestUser = req.query.user;
    res.render("confirmationSignUp", {
      devMode,
      error: null,
      user: req.user,
      new_email: newestUser,
    });
  } catch (err) {
    res.status(500).render("login", {
      error: "Server error - please try again",
      devMode,
      user: req.user,
    });
  }
}
