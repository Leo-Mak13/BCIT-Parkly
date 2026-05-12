import { create_user, get_customers, get_user } from "./src/models/userModel";
import { Customer } from "./src/types/core";
import { EOL } from "os";
import {
  createHashPassword,
  getUserIdByEmail,
} from "./src/services/userService";
import { createSession } from "./src/services/authService";

async function updateTables(email: string, password: string) {
  const hash_Password = await createHashPassword(password);
  const result = await create_user(email, hash_Password);
}

// async function main() {
//   await updateTables("jordan.patel@example.com", "password123");
//   await updateTables("priya.nair@example.com", "abstractbaseclass ");
//   await updateTables("liam.ortiz@example.com", "dylanatethepizza");
//   await updateTables("grace.kim@example.com", "vimdistro");
//   await updateTables("maria.garcia@example.com", "q10vimdistro69");
//   await updateTables("david.chen@example.com", "linux");
//   await updateTables("sarah.johnson@example.com", "crab");
//   await updateTables("michael.t@example.com", "cat");
//   await updateTables("emily.r@example.com", "dog");
//   await updateTables("james.wilson@example.com", "elephant");
//   await updateTables("lisa.anderson@example.com", "minecraft");
//   await updateTables("christopher.lee@example.com", "league");
// }

// const user = await getUserIdByEmail("jordan.patel@example.com");

// console.log(user.email, user.password_hash);

// console.log(user);
