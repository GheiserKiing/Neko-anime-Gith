// File: backend/routes/auth.js

const express = require("express");
const jwt     = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// POST /api/login
router.post("/", express.json(), (req, res) => {
  // Acepta user/pass o username/password
  const username = req.body.username || req.body.user;
  const password = req.body.password || req.body.pass;

  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

module.exports = router;
