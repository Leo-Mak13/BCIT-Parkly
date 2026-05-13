import express from "express";
import { EOL } from "os";
import cookieParser from "cookie-parser";

const PORT: number = 5000;
const app = express();

app.use(cookieParser());

import lotRoutes from "./routes/lotRoutes";
import userRoute from "./routes/userRoute.ts";
import staticRoute from "./routes/staticRoute.ts";
import reserveRoute from "./routes/reserveRoute.ts";

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", lotRoutes);
app.use("/reserve", reserveRoute);
app.use("/users", userRoute);
app.use("/info", staticRoute);

app.listen(PORT, () => {
  console.log(`Running Express server${EOL}http://localhost:5000`);
});
