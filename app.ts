import express from "express";

const app = express();

const PORT = 5000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Running Express server on port ${PORT}...`);
});
