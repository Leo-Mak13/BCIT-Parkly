import { create } from "node:domain";
import { pool } from "../../database/database";
import {
  create_customer,
  get_customer,
  get_customers,
  create_user,
} from "../models/userModel";
import { PasswordMismatchError } from "../middleware/errorTypes";
import { Customer, User } from "../types/core";
import bcrypt from "bcrypt";

/*
 * @func calls database create_customer function with updated parameters, send to
 * @params firstname, lastname, email, phonenumber, password1 and 2 for password validation, valid_permit
 * @returns query object or void
 */
export async function createCustomer(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  firstGoPassword: string,
  secondGoPassword: string,
  valid_permits: string,
): Promise<Customer | void> {
  if (firstGoPassword !== secondGoPassword)
    throw new PasswordMismatchError("Passwords must match!");
  const firstname = firstName.trim().toLowerCase();
  const lastname = lastName.trim().toLowerCase();
  const permit = normalizePermit(valid_permits);
  const result = await create_customer(
    firstname,
    email.trim(),
    phoneNumber.trim(),
    permit,
    lastname,
  );
  const newUser = await createUser(email, secondGoPassword);
  // we do not ever return this created user to the client for security reasons
  return result;
}

function normalizePermit(permit: string): string {
  if (permit === "Student") {
    const permit = "student";
    return permit;
  } else {
    const permit = "staff";
    return permit;
  }
}

/*
 * @func calls database create_user function with updated parameters, send to
 * @params email, hash_password
 * @returns query object or void
 */
async function createUser(
  email: string,
  password: string,
): Promise<User | void> {
  const trimmedEmail = email.trim();
  const hashedPassword = await createHashPassword(password);
  const result = await create_user(trimmedEmail, hashedPassword);
  return result;
}

const saltRounds = 10;

/*
 * @func calls bcrypt's hasher with a salt
 * @params none
 * @returns a hashed password as a string
 */
async function createHashPassword(rawPassword: string): Promise<string> {
  const hashPassword = await bcrypt.hash(rawPassword, saltRounds);
  return hashPassword;
}
