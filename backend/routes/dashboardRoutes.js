
const r = require("express").Router();

const c = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// Get dashboard summary
r.get("/summary", protect, c.summary);

module.exports = r;
