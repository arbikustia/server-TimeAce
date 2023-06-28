const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateLogToken = require("../../utils.js");

const router = express.Router();

// genereate random password
function generateRandomPassword(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

//Create User
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the provided email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

// register oauth
router.post("/oauth", async (req, res) => {
  const password = generateRandomPassword(10);
  try {
    const { fullname, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(201).json({
        id: existingUser._id,
        fullname: existingUser.fullname,
        email: existingUser.email,
        password: existingUser.password,
        token: generateLogToken(existingUser),
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      id: savedUser._id,
      fullname: savedUser.fullname,
      email: savedUser.email,
      password: savedUser.password,
      token: generateLogToken(savedUser),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }

    res.send({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      token: generateLogToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
