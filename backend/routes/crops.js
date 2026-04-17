const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const Field = require("../models/Field");
const ALLOWED_CROPS = ["domates", "biber", "salatalık", "fasulye"];

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı bilgisi zorunludur." });
    }

    const crops = await Crop.find({ userId }).populate("fieldId").sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: "Ürünler getirilemedi." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, name, fieldId, sowingDate } = req.body;

    if (!userId || !name || !fieldId || !sowingDate) {
      return res.status(400).json({ message: "Kullanıcı ID, ürün adı, tarla ID ve ekim tarihi zorunludur." });
    }

    if (!ALLOWED_CROPS.includes(name)) {
      return res.status(400).json({ message: `Geçersiz ürün adı. İzin verilen ürünler: ${ALLOWED_CROPS.join(", ")}` });
    }

    const fieldExists = await Field.findOne({ _id: fieldId, userId });
    if (!fieldExists) {
      return res.status(404).json({ message: "İlgili tarla bulunamadı." });
    }

    const existingCrop = await Crop.findOne({ fieldId, userId });
    if (existingCrop) {
      return res.status(400).json({
        message: "Bu tarlada zaten bir ürün kayıtlı. Önce mevcut ürünü güncelleyin veya silin."
      });
    }

    const crop = await Crop.create({ userId, name, fieldId, sowingDate });

    res.status(201).json({
      message: "Yeni ürün bilgisi eklendi.",
      crop
    });
  } catch (error) {
    res.status(500).json({ message: "Ürün eklenemedi." });
  }
});

router.put("/:cropId", async (req, res) => {
  try {
    const { cropId } = req.params;
    const { userId, name, fieldId, sowingDate } = req.body;

    if (!ALLOWED_CROPS.includes(name)) {
      return res.status(400).json({ message: `Geçersiz ürün adı. İzin verilen ürünler: ${ALLOWED_CROPS.join(", ")}` });
    }

    const updatedCrop = await Crop.findOneAndUpdate(
      { _id: cropId, userId },
      { name, fieldId, sowingDate },
      { new: true, runValidators: true }
    );

    if (!updatedCrop) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.json({
      message: "Ürün bilgisi güncellendi.",
      updatedCrop
    });
  } catch (error) {
    res.status(500).json({ message: "Ürün güncellenemedi." });
  }
});

router.delete("/:cropId", async (req, res) => {
  try {
    const { cropId } = req.params;
    const { userId } = req.query;

    const deletedCrop = await Crop.findOneAndDelete({ _id: cropId, userId });

    if (!deletedCrop) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.json({
      message: "Ürün silindi."
    });
  } catch (error) {
    res.status(500).json({ message: "Ürün silinemedi." });
  }
});

module.exports = router;