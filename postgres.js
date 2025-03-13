const { Client } = require("pg");
require("dotenv").config(); // Load environment variables

const db = new Client({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "echoes",
  password: process.env.PG_PASSWORD || "Abifire",
  port: process.env.PG_PORT || 5432,
});

db.connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));

module.exports = db;
