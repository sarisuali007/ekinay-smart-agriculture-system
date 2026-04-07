const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "Kayıt işlemi başarılı!",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "E-posta veya şifre hatalı." });
    }

    res.json({
      message: "Giriş işlemi başarılı!",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;