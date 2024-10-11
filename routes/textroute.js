const express = require('express');
const { createText, getAllTexts, getTextById, updateText, deleteText } = require('../controllers/textcontroller');
const router = express.Router();

router.post('/', createText);
router.get('/', getAllTexts);
router.get('/:id', getTextById);
router.put('/:id', updateText);
router.delete('/:id', deleteText);

module.exports = router;
