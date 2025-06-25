const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");



exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });

    // If user exists but not verified, resend verification email
    if (user && !user.verified) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save();

      const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
      const html = `<h2>Email Verification</h2><p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`;

      await sendEmail(email, 'Resend: Verify your Email', html);
      return res.status(200).json({ message: "Verification email resent. Please check your inbox." });
    }

    // If verified user already exists
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({ name, email, password, role, verificationToken });
    await newUser.save();

    const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    const html = `<h2>Email Verification</h2><p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`;

    await sendEmail(email, 'Verify your Email', html);
    res.status(201).json({ message: "Signup successful. Check your email to verify your account." });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).send('<h1>Email verified successfully! You can now log in.</h1>');
  } catch (error) {
    console.error('Email verification error:', error.message);
    res.status(500).json({ message: 'Error verifying email' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
