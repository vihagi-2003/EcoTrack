
const r = require("express").Router();
const c = require("../controllers/scheduleController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
r.use(protect);

// Get all schedules
r.get("/", c.list);

// Create a schedule
r.post("/", c.create);

// Update a schedule
r.put("/:id", c.update);

// Delete a schedule
r.delete("/:id", c.remove);

module.exports = r;
