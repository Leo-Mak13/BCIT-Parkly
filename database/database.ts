import mysql from "mysql2";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "bcit_parkly",
    })
    .promise();

// get ALL customers
async function get_customers() {
    const [output] = await pool.query("SELECT * FROM customers");
    return output;
}

// get and individual customer matching ID number
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
    create_customer
}