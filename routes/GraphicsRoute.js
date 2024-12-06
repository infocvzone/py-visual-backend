const express = require("express");
const router = express.Router();
const {
  createSVGGraphics,
  createImageGraphics,
  getAllButtons,
  uploadImages
} = require("../controllers/graphicscontroller");


// Route to handle SVG graphics upload
router.post("/upload-svg", createSVGGraphics);

// Route to handle image upload
router.post("/upload-image", uploadImages, createImageGraphics);

// get all graphics
router.get("/",getAllButtons);
module.exports = router;
