require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./mongodb"); // Import MongoDB connection
const db = require("./postgres"); // Import PostgreSQL connection

const app = express();
app.use(express.json());
app.use(cors());

// Connect Databases
connectMongoDB(); // Connect to MongoDB
// PostgreSQL connection will automatically run from postgres.js

app.get("/", (req, res) => {
  res.send("Echoes Server Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

