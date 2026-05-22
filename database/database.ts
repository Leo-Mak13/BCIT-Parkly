import mysql from "mysql2/promise";
import "dotenv/config";

export const pool: any = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 2911,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "bcit_parkly",

  // udpated settings for stric memory limits
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    maxIdle: 10,
    idleTimeout: 60000
});

// get ALL customers (returns an array of customer objects)
async function get_customers() {
  const [output] = await pool.query("SELECT * FROM customers");
  return output;
}

// get and individual customer matching ID number (returns dict?)
async function get_customer(id: number) {
  const [output] = await pool.query(
    `
        SELECT * FROM customers
        WHERE customer_id = ?
        `,
    [id],
  );

  return output;
}

// creates and returns info of new customer (returns dict?)
async function create_customer(
  customerName: string,
  email: string,
  phone: string,
  customerType: string,
) {
  const [result] = await pool.query(
    `
        INSERT INTO customers (customer_name, email, phone, customer_type)
        VALUES(?, ?, ?, ?)
        `,
    [customerName, email, phone, customerType],
  );
  return {
    name: customerName,
    email: email,
    phone: phone,
    customerType: customerType,
  };
}

//insert reservation into database

async function main() {
  try {
    const creationConfirmation = await create_customer(
      "bao",
      "bao@gmail.com",
      "123123",
      "student",
    );
    const customers = await get_customers();
    const singleCustomer = await get_customer(1);
    console.log("Customers:");
    console.table(customers);
    console.log("Your info:");
    console.table(singleCustomer);
    console.log("Account Created:");
    console.table(creationConfirmation);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

// main();
export { get_customers, get_customer };
