import express from "express";
import {
  get_customers,
  get_customer,
  create_customer,
} from "../database/database.ts";
import reserveRoute from "../src/routes/reserveRoute.js";
import { EOL } from "os";
import session from "express-session";

const PORT: number = 3000;
const app = express();

import lotRoutes from "./routes/lotRoutes";
import authRoute from "./routes/authRoute";
import signupRoute from "./routes/signupRoute";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", lotRoutes);
app.use(authRoute);
app.use("/reservations", reserveRoute);

app.use("/", signupRoute);

app.listen(PORT, () => {
  console.log(`Running Express server${EOL}http://localhost:3000`);
});
