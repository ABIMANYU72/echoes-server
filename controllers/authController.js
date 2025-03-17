const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../postgres");
const User = require("../models/userMG");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists (PostgreSQL)
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in PostgreSQL
    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    // Store metadata in MongoDB
    const mongoUser = new User({ userId: newUser.rows[0].id });
    await mongoUser.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists (PostgreSQL)
      const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userQuery.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const user = userQuery.rows[0];
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT Token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const getUserProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Fetch user from PostgreSQL
      const userQuery = await db.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
  
      if (userQuery.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const user = userQuery.rows[0];
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, email } = req.body;
  
      // Update user in PostgreSQL
      await db.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, userId]);
  
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
  
  
  
