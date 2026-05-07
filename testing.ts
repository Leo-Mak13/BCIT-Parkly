import crypto from "crypto";
import { EOL } from "os";
import {
  createSession,
  validateSessionToken,
} from "./src/middleware/authMiddleware.js";
import {
  create_session,
  get_session,
  delete_session,
} from "./database/database.js";

// function generateSecureRandomString(): string {
//   /*
//     For generating session IDs and secrets
//     Generate 24-length byte array, encode it into a string, using 120 bits of entropy
//     Using crypto - secure random generator
//     Returns a 24-length byte array as string
//   */
//   const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";

//   const bytes = new Uint8Array(24);
//   crypto.getRandomValues(bytes);

//   let id = "";
//   for (let i: number = 0; i < bytes.length; i++) {
//     const byte = bytes[i];
//     if (byte !== undefined) {
//       id += alphabet[byte >> 3];
//     }
//   }
//   return id;
// }

// async function hashSecret(secret: string): Promise<Uint8Array> {
//   const secretBytes = new TextEncoder().encode(secret);
//   const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
//   return new Uint8Array(secretHashBuffer);
// }

// async function main() {
//   const testSecret = generateSecureRandomString();
//   console.log(testSecret, EOL, testSecret.length);

//   const hashedSecret = await hashSecret(testSecret);
//   console.log(hashedSecret);
// }

// main();

// test session creation and insertion into DB

// async function testSession() {
//   try {
//     const session = await createSession();
//     console.log("Token: ", session.token);
//   } catch (err) {
//     console.log("ERROR!", err);
//   }
// }
// testSession();

const testToken = "zvhi64cdvzthunh4sj6ilbwr.4slqw3p2kf5nbp1rk2dhz2fr";

// async function testValidate() {
//   try {
//     const session = await validateSessionToken(testToken);
//     console.log("Success?", EOL, session);
//   } catch (err) {
//     console.log("ERROR!", err);
//   }
// }

// testValidate();

async function testFuncs() {
  try {
    const result = await validateSessionToken(testToken);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

testFuncs();
