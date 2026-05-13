import { Request, Response } from "express";

const devMode = process.env.MODE;

export function permitRatesHandler(req: Request, res: Response) {
  try {
    res.render("permits-rates", { devMode, error: null, user: req.user });
  } catch (err) {
    res.status(500).render("signup", {
      message: "Server error - please try again",
      devMode,
      user: req.user,
    });
  }
}

export function helpSupportHandler(req: Request, res: Response) {
  try {
    res.render("help-support", { devMode, error: null, user: req.user });
  } catch (err) {
    res.status(500).render("signup", {
      message: "Server error - please try again",
      devMode,
      user: req.user,
    });
  }
}
