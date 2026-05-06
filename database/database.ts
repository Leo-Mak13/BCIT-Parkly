import mysql from "mysql2";
import "dotenv/config";


const pool: any = mysql
    .createPool({
        host: process.env.MYSQL_HOST || "localhost",
        port: Number(process.env.MYSQL_PORT) || 2911,
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "bcit_parkly",
    })
    .promise();

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

export { get_customers, get_customer, create_customer, create_reservation, pool };
