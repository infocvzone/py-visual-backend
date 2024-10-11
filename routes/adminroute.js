const express = require('express');
const { signupAdmin, loginAdmin, getAllAdmins, deleteAdmin, verifyOtp } = require('../controllers/admincontroller');
const router = express.Router();

router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.post('/otp-verify', verifyOtp);
router.get('/', getAllAdmins);
router.delete('/:id', deleteAdmin);

module.exports = router;
