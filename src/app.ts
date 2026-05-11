import express from "express";
import {
  get_customers,
  get_customer,
  create_customer,
} from "../database/database.ts";
import reserveRoute from "../src/routes/reserveRoute.js";
import { EOL } from "os";

const PORT: number = 5000;
const app = express();

import lotRoutes from "./routes/lotRoutes";
import userRoute from "./routes/userRoute.ts";

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", lotRoutes);
app.use("/reservations", reserveRoute);

app.use("/", userRoute);

app.listen(PORT, () => {
  console.log(`Running Express server${EOL}http://localhost:5000`);
});
