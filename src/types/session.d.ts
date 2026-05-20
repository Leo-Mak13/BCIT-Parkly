import * as express from "express";

/**
 * custom interface for sessions
 */
interface Session {
  id: string;
  secretHash: Uint8Array;
  createdAt: Date;
  user_id: number;
}

interface SessionRow {
  id: string;
  secret_hash: Buffer;
  created_at: Date;
  user_id: number;
}

// let the imported request object also contain a cookie key, and a user key
// extend the Request object from Express to contain custom
declare global {
  namespace Express {
    interface Request {
      cookies: Record<string, string>;
      user?: { id: number; email: string } | null;
    }
  }
}

export type { Session, SessionRow };
