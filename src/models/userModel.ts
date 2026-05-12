import { pool } from "../../database/database.js";

async function create_customer(
  first_name: string,
  email: string,
  phone: string,
  valid_permits: string,
  last_name: string,
) {
  const [stmt] = await pool.query(
    `INSERT INTO customers (first_name, email, phone, valid_permits, last_name)
        VALUES (?, ?, ?, ?, ?);`,
    [first_name, email, phone, valid_permits, last_name],
  );
}

async function get_customers() {
  const [result] = await pool.query("SELECT * FROM customers");
  return result;
}

async function get_customer(id: number) {
  const [result] = await pool.query(
    `
        SELECT * FROM customers
        WHERE customer_id = ?
        `,
    [id],
  );

  return result;
}

async function create_user(email: string, password: string) {
  const [stmt] = await pool.query(
    `INSERT INTO users (email, password_hash) VALUES (?, ?);`,
    [email, password],
  );
}

async function get_user(email: string) {
  const [stmt] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return stmt[0];
}

async function get_user_by_id(id: number) {
  const [stmt] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return stmt[0];
}

export {
  create_customer,
  get_customer,
  get_customers,
  create_user,
  get_user,
  get_user_by_id,
};
