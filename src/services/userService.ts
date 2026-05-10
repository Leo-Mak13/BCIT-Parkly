import { create } from "node:domain";
import { pool } from "../../database/database";
import {
  create_customer,
  get_customer,
  get_customers,
  create_user,
} from "../models/userModel";

/*
 * @func calls database create_user function with updated parameters, send to
 */
export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  firstGoPassword: string,
  secondGoPassword: string,
) {
  const stmt = create_customer();
}
