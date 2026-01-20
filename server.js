const express = require("express");

const app = express();

// Support both JSON and form-encoded (Webflow uses both sometimes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Backend is running");
});

// Debug webhook route
app.post("/submit", (req, res) => {
  console.log("=== /submit HIT ===");
  console.log("RAW BODY:", req.body);
  console.log("BODY.data:", req.body.data);
  console.log("BODY.recaptcha_token:", req.body.recaptcha_token);

  res.status(200).send("OK");
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});

