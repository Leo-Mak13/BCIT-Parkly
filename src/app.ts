import express from "express";
import {
  get_customers,
  get_customer,
  create_customer,
} from "../database/database.ts";
import { EOL } from "os";
import lotRoutes from "./routes/lotRoutes";

const PORT: number = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/", lotRoutes);

app.get("/customers", async (req, res) => {
  const customers = await get_customers();

  res.render("customers", { customers });
});

app.listen(PORT, () => {
  console.log(`Running Express server${EOL}http://localhost:3000`);
});