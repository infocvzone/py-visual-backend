const express = require('express');
const { createImage, getAllImages, deleteImage } = require('../controllers/imagecontroller');
const router = express.Router();

router.post('/', createImage);
router.get('/', getAllImages);
router.delete('/:id', deleteImage);

module.exports = router;
