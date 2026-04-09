const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json({
      message: "Kullanıcı bilgileri güncellendi.",
      updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;  
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json({
      message: "Kullanıcı silindi.",
      deletedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json({
      message: "Kullanıcı bilgileri getirildi.",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;