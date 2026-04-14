const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const Field = require("../models/Field");

router.get("/", async (req, res) => {
    try {
        const crops = await Crop.find().populate("fieldId").sort({ createdAt: -1 });
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: "Ürünler getirilemedi." });
    }
});

router.post("/", async (req, res) => {
  try {
    const { name, fieldId } = req.body;

    if (!name || !fieldId) {
      return res.status(400).json({ message: "Ürün adı ve tarla ID zorunludur." });
    }

    const fieldExists = await Field.findById(fieldId);
    if (!fieldExists) {
      return res.status(404).json({ message: "İlgili tarla bulunamadı." });
    }

    const crop = await Crop.create({ name, fieldId });

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
    const { name, fieldId } = req.body;

    const updatedCrop = await Crop.findByIdAndUpdate(
      cropId,
      { name, fieldId },
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

    const deletedCrop = await Crop.findByIdAndDelete(cropId);

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