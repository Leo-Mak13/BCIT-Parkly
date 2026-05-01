import express from "express";

const PORT: number = 5000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});
