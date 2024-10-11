require("dotenv").config();
const nodemailer = require('nodemailer');
const Admin = require('../models/adminmodel');

/**
 * Sends an OTP to the provided email and updates the admin record with the OTP and its expiration time.
 * @param {string} email - The email address to which the OTP should be sent.
 * @throws {Error} - If there is an issue with sending the OTP or updating the admin record.
 */
const sendOtp = async (email) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Ensure environment variables are available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Environment variables for email and password are not set');
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Set up the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // send the OTP to the provided email, not the sender's email
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}.`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Update the admin record with the OTP and expiration time
    const result = await Admin.updateOne(
      { email },
      { otp, otpExpires: new Date(Date.now() + 15 * 60 * 1000) } // OTP expires in 15 minutes
    );

    // Check if the admin record was successfully updated
    if (result.nModified === 0) {
      throw new Error('Admin not found or OTP update failed');
    }
  } catch (error) {
    // Log the error and rethrow it for further handling
    console.error('Error sending OTP:', error);
    throw new Error('Error sending OTP');
  }
};

module.exports = sendOtp;