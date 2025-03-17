const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route (Test Endpoint)
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;



