import express from "express";
import {
  get_customers,
  get_customer,
  create_customer,
} from "../database/database.ts";
import reserveRoute from "../routes/reserveRoute.js";
import { EOL } from "os";

const PORT: number = 5000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/reservations", reserveRoute);

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/customers", async (req, res) => {
  const customers = await get_customers();

  res.render("customers", { customers });
});

app.listen(PORT, () => {
  console.log(`Running Express server${EOL}http://localhost:5000`);
});
