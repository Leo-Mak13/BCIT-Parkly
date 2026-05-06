import crypto from "crypto";
import type { Session, SessionRow } from "../types/session";

function generateSecureRandomString(): string {
  /*
    For generating session IDs and secrets
    Generate 24-length byte array, encode it into a string, using 120 bits of entropy
    Using crypto - secure random generator
  */
  const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";

  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i: number = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      id += alphabet[byte >> 3];
    }
  }
  return id;
}
