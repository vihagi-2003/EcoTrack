
const r = require("express").Router();
const c = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

// Check user authentication
r.use(protect);

// Request routes
r.get("/", c.list);
r.post("/", c.create);
r.get("/:id", c.get);
r.put("/:id", c.update);
r.delete("/:id", c.remove);

module.exports = r;