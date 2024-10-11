const Admin = require('../models/adminmodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtp = require('../utility/otpsend');

// Signup Admin
exports.signupAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const newAdmin = new Admin({
      username,
      email,
      password
    });
    await newAdmin.save();
    await sendOtp(email);
    res.status(200).json({ message: 'Admin created. Please verify your email.' });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


//otp-verify
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    if (admin.otp === otp) {
      admin.status = 'verified';
      admin.otp = undefined;
      await admin.save();
      res.status(200).json({ message: 'Account verified successfully.' });
    } else {
      res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: 'Admin not found.' });

      if (admin.status !== 'verified') return res.status(403).json({ message: 'Admin not verified.' });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
      res.status(200).json({ token, admin });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
