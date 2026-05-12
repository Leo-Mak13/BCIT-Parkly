interface Session {
  id: string;
  secretHash: Uint8Array;
  createdAt: Date;
}

interface SessionRow {
  id: string;
  secret_hash: Buffer;
  created_at: Date;
}

export type { Session, SessionRow };
