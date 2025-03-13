require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./mongodb"); 
const db = require("./postgres"); 

const app = express();
app.use(express.json());
app.use(cors());

connectMongoDB(); 


app.get("/", (req, res) => {
  res.send("Echoes Server Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

