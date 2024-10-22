const express = require("express");
const {
  createButton,
  getAllButtons,
  getButtonById,
  updateButton,
  deleteButton,
} = require("../controllers/circleController");
const router = express.Router();

router.post("/", createButton);
router.get("/", getAllButtons);
router.get("/:id", getButtonById);
router.put("/:id", updateButton);
router.delete("/:id", deleteButton);

module.exports = router;
