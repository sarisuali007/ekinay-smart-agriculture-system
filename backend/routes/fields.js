const express = require("express");
const router = express.Router();
const Field = require("../models/Field");

router.get("/", async (req, res) => {
  try {
    const fields = await Field.find().sort({ createdAt: -1 });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: "Tarlalar getirilemedi." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, location, latitude, longitude, areaM2, isGreenhouse, polygon } = req.body;

    if (!name || !location || latitude === undefined || longitude === undefined || !polygon || !Array.isArray(polygon) || polygon.length < 3) {
      return res.status(400).json({ message: "Tarla adı, konum, enlem ve boylam zorunludur." });
    }

    const field = await Field.create({ 
      name,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      areaM2: areaM2 ? Number(areaM2) : 0,
      isGreenhouse: Boolean(isGreenhouse),
      polygon: polygon.map(point => ({
        lat: Number(point.lat),
        lng: Number(point.lng)
      }))
    });

    res.status(201).json({
      message: "Yeni tarla bilgisi eklendi.",
      field
    });
  } catch (error) {
    res.status(500).json({ message: "Tarla eklenemedi." });
  }
});

router.put("/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { name, location, latitude, longitude, areaM2, isGreenhouse, polygon } = req.body;

    const updatedField = await Field.findByIdAndUpdate(
      fieldId,
      {
      name,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      areaM2: areaM2 ? Number(areaM2) : 0,
      isGreenhouse: Boolean(isGreenhouse),
      polygon: polygon ? polygon.map(point => ({
        lat: Number(point.lat),
        lng: Number(point.lng)
      })) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!updatedField) {
      return res.status(404).json({ message: "Tarla bulunamadı." });
    }

    res.json({
      message: "Tarla bilgisi güncellendi.",
      updatedField
    });
  } catch (error) {
    res.status(500).json({ message: "Tarla güncellenemedi." });
  }
});

router.delete("/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;

    const deletedField = await Field.findByIdAndDelete(fieldId);

    if (!deletedField) {
      return res.status(404).json({ message: "Tarla bulunamadı." });
    }

    res.json({
      message: "Tarla silindi."
    });
  } catch (error) {
    res.status(500).json({ message: "Tarla silinemedi." });
  }
});

module.exports = router;