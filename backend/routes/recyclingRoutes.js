const router = require("express").Router();
const recyclingController = require("../controllers/recyclingController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Recycling routes
router.get("/", recyclingController.list);
router.post("/", recyclingController.create);
router.put("/:id", recyclingController.update);
router.delete("/:id", recyclingController.remove);

module.exports = router;