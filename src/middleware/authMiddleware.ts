import crypto from "crypto";
import type { Session, SessionRow } from "../types/session";
import {
  create_session,
  get_session,
  delete_session,
} from "../../database/database";

interface SessionWithToken extends Session {
  token: string;
}

function generateSecureRandomString(): string {
  /*
    For generating session IDs and secrets
    Generate 24-length byte array, encode it into a string, using 120 bits of entropy
    Using crypto - secure random generator
    Returns a 24-length byte array as string 
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

async function createSession(): Promise<SessionWithToken> {
  const now = new Date();
  const id = generateSecureRandomString(); // session id - used for lookup
  const secret = generateSecureRandomString(); // secret - stored as SHA-256 hash
  const secretHash = await hashSecret(secret);

  const token = id + "." + secret;
  // This is the session token given to the cookie, used for signin and reauthentication

  const session: SessionWithToken = {
    id,
    secretHash,
    createdAt: now,
    token,
  };

  const insertDb = create_session(
    session.id,
    Buffer.from(session.secretHash),
    session.createdAt,
  );
  // Insert into sessions: session id, hashed secret, and session creation date - creation date used for verifying expiry

  return session;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}

const sessionExpiresInSeconds = 60 * 60 * 48; // 2 day expiration before session deletion

async function validateSessionToken(token: string): Promise<Session | null> {
  /*
    Using the cookie token, split into parts = session id and session secret
    
    Return a session if authentication - otherwise null
  */
  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) {
    return null;
  }
  const sessionId = tokenParts[0];
  const sessionSecret = tokenParts[1];
  if (!sessionId || !sessionSecret) {
    return null;
  }

  const session = await getSession(sessionId); // lookup a session entry by session id, compare incoming cookie hash
  if (!session) {
    return null;
  }
  const tokenSecretHash = await hashSecret(sessionSecret);
  const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash); // compare already hashed secret (session.secretHash) with incoming request secretHash
  if (!validSecret) {
    return null;
  }
  return session;
}

async function getSession(sessionId: string): Promise<Session | null> {
  const now = new Date(); // compare today's current date to the expiration stored in the session

  const currentSession = get_session(sessionId) as SessionRow[];

  if (currentSession.length === 0) {
    return null;
  }
  const row = currentSession[0];
  if (!row) {
    return null;
  }
  const session: Session = {
    id: row.id,
    secretHash: new Uint8Array(row.secret_hash),
    createdAt: row.created_at,
  };

  console.log("*********************TEST!!!!!!!!!!", session);

  if (
    now.getTime() - session.createdAt.getTime() >=
    sessionExpiresInSeconds * 1000
  ) {
    await deleteSession(sessionId);
    return null;
  }
  return session;
}

async function deleteSession(sessionId: string): Promise<void> {
  const result = delete_session(sessionId);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (!a || !b) {
    return false;
  }
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i]! ^ b[i]!;
  }
  return c === 0;
}

export { createSession, validateSessionToken };
