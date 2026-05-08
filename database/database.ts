import mysql from "mysql2/promise";
import "dotenv/config";

export const pool: any = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 2911,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "bcit_parkly",
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

async function get_reservations(id: string) {
  const [output] = await pool.query(
    `
        SELECT reservation_id, stall_location, purchase_date, total_cost, license_plate FROM reservations
        WHERE customer_id = ?
    `,
    [id],
  );
  return output;
}

async function get_reservation(id: string) {
  const [output] = await pool.query(
    `
        SELECT stall_location, total_cost, purchase_date, parking_lots.lot_floor, parking_lots.lot_name, parking_stalls.parking_type FROM reservations
        INNER JOIN parking_stalls ON reservations.stall_id = parking_stalls.stall_id
        INNER JOIN parking_lots ON reservations.lot_id = parking_lots.lot_id
        WHERE reservation_id = ?
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
async function create_reservation(
  license_plate: string,
  total_cost: number,
  stall_location: string,
  lot_id: number,
  stall_id: number,
  customer_id: number,
) {
  const [result] = await pool.query(
    `INSERT INTO reservations (license_plate, total_cost, stall_location, lot_id, stall_id, customer_id)
        VALUES(?, ?, ?, ?, ?, ?)`,
    [license_plate, total_cost, stall_location, lot_id, stall_id, customer_id],
  );
}

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
export {
  get_customers,
  get_customer,
  get_reservations,
  get_reservation,
  create_customer,
  create_reservation,
};
