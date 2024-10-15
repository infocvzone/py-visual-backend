const express = require("express");
const router = express.Router();
const fontController = require("../controllers/fontController");

// POST route for uploading a font
router.post("/", fontController.upload, fontController.uploadFont);

// GET route for retrieving fonts
router.get("/", fontController.getFonts);

// DELETE route for deleting a font
router.delete("/:id", fontController.deleteFont);

module.exports = router;

