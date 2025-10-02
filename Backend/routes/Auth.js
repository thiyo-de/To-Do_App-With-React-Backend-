const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");      // For hashing passwords
const jwt = require("jsonwebtoken");     // For creating JWT tokens
require("dotenv").config();

// ---------------- Register Route ----------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);        // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password

    // 4. Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save(); // Save user to DB

    // 5. Create JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // 6. Send response
    res.json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ---------------- Login Route ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 4. Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Send response
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
