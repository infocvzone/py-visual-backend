const express = require('express');
const { signup, login, getAllUsers, getUserById, deleteUser } = require('../controllers/usercontroller');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
