
const router = require("express").Router();

const complaintController = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", complaintController.list);
router.post("/", complaintController.create);
router.put("/:id", complaintController.update);
router.delete("/:id", complaintController.remove);

module.exports = router;
