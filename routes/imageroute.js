const express = require('express');
const { createImage, getAllImages, deleteImage, uploadImage} = require('../controllers/imagecontroller');
const router = express.Router();

router.post('/', uploadImage , createImage);
router.get('/', getAllImages);
router.delete('/:id', deleteImage);

module.exports = router;
