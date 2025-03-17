const db = require("../postgres");
const crypto = require("crypto");

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      reset_token TEXT,  -- Token for password reset
      reset_token_expiry TIMESTAMP,  -- Expiry time for reset token
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log("✅ PostgreSQL Users Table Created (if not exists)");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  }
};

// Generate Password Reset Token
const generateResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

  await db.query(
    "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
    [token, expiresAt, userId]
  );

  return token;
};

createUserTable();

module.exports = { db, generateResetToken };
