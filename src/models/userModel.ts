import { pool } from "../../database/database.js";

async function create_customer(
  customer_name: string,
  email: string,
  phone: number,
  valid_permits: string,
) {
  const [stmt] = await pool.query(
    `INSERT INTO customers (customer_name, email, phone, valid_permits)
        VALUES (?, ?, ?);`,
    [customer_name, email, phone, valid_permits],
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
  const [stmt] = await pool.query(`INSERT INTO users (email, password_hash)`);
}

export { create_customer, get_customer, get_customers, create_user };
