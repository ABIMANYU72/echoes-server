require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./mongodb"); 
const db = require("./postgres"); 
require("./models/userPG"); // Ensure PostgreSQL table is created

const app = express();
app.use(express.json());
app.use(cors());

connectMongoDB(); 

app.get("/", (req, res) => {
  res.send("Echoes Server Running...");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));


