const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me,
  getUsers,
  deleteUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged-in user
router.get("/me", protect, me);

// Get all users
router.get("/users", protect, getUsers);

// Delete user (Admin only; checked in controller)
router.delete("/users/:id", protect, deleteUser);

module.exports = router;
