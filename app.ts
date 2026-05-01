import express from "express";
import {
    get_customers,
    get_customer,
    create_customer,
} from "./database/database.js";

const app = express();

const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/customers", async (req, res) => {
    const customers = await get_customers();

    res.render("customers", { customers });
});

app.listen(PORT, () => {
    console.log(`Running Express server on port ${PORT}...`);
});

