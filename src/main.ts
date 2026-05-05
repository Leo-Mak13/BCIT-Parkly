import express from "express";
import { get_customers, get_customer, create_customer } from "../database.js";

const PORT: number = 5000;
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("main");
});

app.get("/customers", async (req, res) => {
    const customers = await get_customers();

    res.render("customers", { customers });
});

app.listen(PORT, () => {
    console.log(`Running Express server on port ${PORT}...`);
});
