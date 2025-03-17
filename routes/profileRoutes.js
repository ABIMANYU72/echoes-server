const express = require("express");
const router = express.Router();
const db = require("../postgres"); // PostgreSQL connection
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

// ✅ Update User Profile (name, email)
router.put("/update", authMiddleware, async (req, res) => {
    console.log("User from token:", req.user); // Debugging line
    const { name, email } = req.body;
    const userId = req.user.id; // Make sure this is not `undefined`
  
    if (!userId) {
      return res.status(400).json({ message: "Invalid token, user ID missing" });
    }
  
    try {
      const result = await db.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Profile updated successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// ✅ Change Password
router.put("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Fetch user by ID
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
