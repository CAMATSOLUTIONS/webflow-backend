const express = require("express");
const axios = require("axios");

const app = express();

// Webflow can send JSON or form-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Backend is running");
});

// Webflow webhook route
app.post("/submit", async (req, res) => {
  try {
    console.log("=== /submit HIT ===");
    console.log("RAW BODY:", req.body);

    // Correct path from your logs:
    const formData = req.body.payload?.data || {};
    const token = formData.recaptcha_token;

    console.log("Form data:", formData);
    console.log("Token received:", token);

    if (!token) {
      console.log("No reCAPTCHA token found");
      return res.status(400).send("No reCAPTCHA token");
    }

    // Verify with Google
    const googleResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6LdeqEspAAAAAET3kGGglzh3MUdnp6IeUm0W3e4X",
          response: token
        }
      }
    );

    console.log("Google response:", googleResponse.data);

    const result = googleResponse.data;

    if (!result.success) {
      console.log("reCAPTCHA failed");
      return res.status(403).send("reCAPTCHA failed");
    }

    if (result.score < 0.5) {
      console.log("Low score, likely bot:", result.score);
      return res.status(403).send("Bot detected");
    }

    console.log("Human confirmed, form accepted");
    res.status(200).send("OK");

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});

