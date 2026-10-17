
const r = require("express").Router();

const c = require("../controllers/collectorController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
r.use(protect);

// Get all collectors
r.get("/", c.list);

module.exports = r;
