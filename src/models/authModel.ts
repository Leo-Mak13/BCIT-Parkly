import { pool } from "../../database/database.js";

async function create_session(
  id: string,
  secret_hash: Buffer,
  created_at: Date,
  user_id: number,
) {
  const [stmt] = await pool.query(
    `INSERT INTO sessions (id, secret_hash, created_at, user_id)
    VALUES (?, ?, ?, ?);`,
    [id, secret_hash, created_at, user_id],
  );
}

async function get_session(id: string) {
  const [stmt] = await pool.query(`SELECT * FROM sessions WHERE id = ?`, [id]);
  return stmt;
}

async function delete_session(id: string) {
  const [stmt] = await pool.query(`DELETE FROM sessions WHERE id = ?`, [id]);
}

export { create_session, get_session, delete_session, pool };
