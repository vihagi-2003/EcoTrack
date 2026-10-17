
const r = require("express").Router();
const c = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
r.use(protect);

// Get all requests
r.get("/", c.list);

// Create a request
r.post("/", c.create);

// Get one request by ID
r.get("/:id", c.get);

// Update a request
r.put("/:id", c.update);

// Delete a request
r.delete("/:id", c.remove);

module.exports = r;
