import { create } from "node:domain";
import { pool } from "../../database/database";
import {
  create_customer,
  get_customer,
  get_customers,
  create_user,
  get_user,
  get_user_by_id,
  get_all_emails,
} from "../models/userModel";
import { delete_session_by_user_id } from "../models/authModel";
import {
  PasswordMismatchError,
  EmailInUseError,
  IncorrectEmailPasswordError,
} from "../middleware/errorTypes";
import { Customer, User } from "../types/core";
import bcrypt from "bcrypt";

/**
 * @func calls database create_customer function with updated parameters, send to
 * @params firstname, lastname, email, phonenumber, password1 and 2 for password validation, valid_permit
 * @returns query object or void
 */
export async function createNewCustomerUser(
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

/**
 * @func normalizePermit ensure that permit type is all lowercase with no whitespace
 * @param permit - passed in string
 * @returns - returns normalized string
 */
function normalizePermit(permit: string): string {
  if (permit === "Student") {
    const permit = "student";
    return permit;
  } else {
    const permit = "staff";
    return permit;
  }
}

/**
 * @func createUser calls database create_user function with updated parameters, send to
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

/**
 * @func createHashPassword calls bcrypt's hasher with a salt
 * @params none
 * @returns a hashed password as a string
 */
export async function createHashPassword(rawPassword: string): Promise<string> {
  const hashPassword = await bcrypt.hash(rawPassword, saltRounds);
  return hashPassword;
}

/**
 * @func validateUser validates user via lookup in table users, then compares plaintext password to hashed password with bcrypt
 * @params email and password from html form
 * @returns boolean true or false if lookup AND validation successful
 */
export async function validateUser(
  email: string,
  password: string,
): Promise<boolean | void> {
  const user = await get_user(email);
  if (!user) {
    throw new IncorrectEmailPasswordError("Email or password do not match!");
  } else {
    const hashPassword = user.password_hash;
    const validPassword = await bcrypt.compare(password, hashPassword);
    if (validPassword) {
      return validPassword;
    } else {
      throw new IncorrectEmailPasswordError("Email or password do not match!");
    }
  }
}

/**
 * @func validateEmailNotUsed checks that incoming email for registration is not used
 * @param new_customer_email incoming email to be used for registration
 * @returns a boolean - true if valid email (no one using it), or false for in-use
 */
export async function validateEmailNotUsed(
  new_customer_email: string,
): Promise<boolean> {
  const emails = await get_all_emails();
  if (new_customer_email in emails) {
    return false;
  } else {
    throw new EmailInUseError("Email already in use!");
  }
}

/**
 * @func getUserByEmail - get the customer ID via email from users JOIN customers
 * @param email
 * @returns a number
 */
export async function getUserIdByEmail(email: string): Promise<number> {
  let userId = await get_user(email);
  userId = userId.id;
  return userId;
}

/**
 * @func getUserById get the user via email from users table
 * @param id
 * @returns - a user from the database
 */
export async function getUserById(id: number): Promise<User> {
  const user = await get_user_by_id(id);
  return user;
}

/**
 * @func logOutDeleteSession - by logging out, we delete the session
 * @param user_id
 */
export async function logOutDeleteSession(user_id: number) {
  const result = await delete_session_by_user_id(user_id);
}
