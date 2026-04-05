require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { fetchPersonData } = require("./gemini");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.get("/api/search", async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Name parameter required" });

  if (!API_KEY) return res.status(500).json({ error: "OPENROUTER_API_KEY not set" });

  try {
    const data = await fetchPersonData(name, API_KEY);
    res.json(data);
  } catch (err) {
    console.error("OpenRouter API error:", err.message);
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
});

// Suggestions endpoint
app.get("/api/suggestions", (req, res) => {
  res.json([
    "Shivaji Maharaj",
    "Aurangzeb",
    "Akbar",
    "Rani Lakshmibai",
    "Ashoka",
    "Prithviraj Chauhan",
    "Tipu Sultan",
    "Maharana Pratap",
    "Chandragupta Maurya",
    "Babur",
  ]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
