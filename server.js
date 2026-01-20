const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Backend is running");
});

app.post("/submit", (req, res) => {
  console.log("=== /submit HIT ===");
  console.log("Body:", req.body);
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});

