import crypto from "crypto";
import type { Session, SessionRow } from "../types/session";
import { validateSessionToken } from "../services/authService";
import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/userService";

/*
 *@func authentication middleware - call next(), after checking session validation
 *@params req, res, nextFunction
 *@returns populates a req.user with either null (no associated session, so no user) or a populated req.user (session validated, attached corresponding id and email from users table)
 */
export async function authValidation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.auth_session;

  // if token doesn't exist, means they have no session - not logged in, so go next() function
  if (!token) {
    req.user = null;
    return next();
  }

  // token exists - now try to validate it
  try {
    const session = await validateSessionToken(token);
    if (!session) {
      // session expired - deleted from database
      res.clearCookie("auth_session");
      req.user = null;
    } else {
      // session exists - attach req.user with appropriate data
      const userId = session.user_id;
      const user = await getUserById(userId);
      req.user = { id: userId, email: user.email };
    }
  } catch (err) {
    req.user = null;
  }
  next();
}
