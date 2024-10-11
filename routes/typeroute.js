const express = require('express');
const { createType, getAllTypes, updateType, deleteType } = require('../controllers/typecontroller');
const router = express.Router();

router.post('/', createType);
router.get('/', getAllTypes);
router.put('/:id', updateType);
router.delete('/:id', deleteType);

module.exports = router;
