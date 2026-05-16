const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Field = require("../models/Field");
const Crop = require("../models/Crop");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json({
      message: "Kullanıcı bilgileri getirildi.",
      user,
    });
  } catch (error) {
    console.error("Kullanıcı bilgileri getirilemedi:", error);
    res.status(500).json({ message: "Kullanıcı bilgileri getirilemedi." });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const trimmedName = String(name || "").trim();
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = String(password || "").trim();

    if (!trimmedName) {
      return res.status(400).json({ message: "Ad alanı zorunludur." });
    }

    if (!normalizedEmail) {
      return res.status(400).json({ message: "E-posta alanı zorunludur." });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const emailOwner = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (emailOwner) {
      return res.status(400).json({
        message: "Bu e-posta başka bir kullanıcı tarafından kullanılıyor.",
      });
    }

    const updateData = {
      name: trimmedName,
      email: normalizedEmail,
    };

    if (trimmedPassword) {
      updateData.password = trimmedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: trimmedPassword
        ? "Kullanıcı bilgileri ve şifre güncellendi."
        : "Kullanıcı bilgileri güncellendi. Şifre değiştirilmedi.",
      updatedUser,
    });
  } catch (error) {
    console.error("Kullanıcı güncellenemedi:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Girilen kullanıcı bilgileri geçerli değil.",
        details: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Bu e-posta zaten kayıtlı.",
      });
    }

    res.status(500).json({ message: "Kullanıcı güncellenemedi." });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const deletedFields = await Field.deleteMany({ userId });
    const deletedCrops = await Crop.deleteMany({ userId });

    res.json({
      message: "Kullanıcı ve kullanıcıya bağlı tarla/ürün bilgileri silindi.",
      deletedUser,
      deletedFieldCount: deletedFields.deletedCount || 0,
      deletedCropCount: deletedCrops.deletedCount || 0,
    });
  } catch (error) {
    console.error("Kullanıcı silinemedi:", error);
    res.status(500).json({ message: "Kullanıcı silinemedi." });
  }
});

router.put("/:userId/push-token", async (req, res) => {
  try {
    const { userId } = req.params;
    const { expoPushToken, pushAlertsEnabled } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        expoPushToken: expoPushToken || "",
        pushAlertsEnabled: pushAlertsEnabled !== false,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json({
      message: "Push token kaydedildi.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Push token kaydedilemedi:", error);
    res.status(500).json({ message: "Push token kaydedilemedi." });
  }
});

module.exports = router;