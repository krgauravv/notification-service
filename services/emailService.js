const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS   
  }
});

// Function to send an email
exports.sendEmail = async (to, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,               
      subject: 'Notification Service',
      text: message
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};
