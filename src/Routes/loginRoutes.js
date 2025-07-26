const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const routers = express.Router();
const LoginData = require("../model/loginData");

// ✅ Middleware to verify token
function verifyTokens(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // { username, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

// ✅ Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Restricted to admins only" });
  }
  next();
}

// ✅ Register Route
routers.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await LoginData.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new LoginData({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const responseData = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({ message: "User registered", data: responseData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Login Route
routers.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await LoginData.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        username: existingUser.username,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: existingUser.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Current User Info
routers.get("/me", verifyTokens, async (req, res) => {
  try {
    const user = await LoginData.findOne({ username: req.user.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.json({ username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ✅ Admin Route (Example Protected Route)
routers.get("/admin", verifyTokens, isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome admin" });
});

module.exports = routers;
