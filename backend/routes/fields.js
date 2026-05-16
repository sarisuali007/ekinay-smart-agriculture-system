const express = require("express");
const router = express.Router();

const Field = require("../models/Field");
const Crop = require("../models/Crop");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı bilgisi zorunludur." });
    }

    const fields = await Field.find({ userId }).sort({ createdAt: -1 });
    res.json(fields);
  } catch (error) {
    console.error("Tarlalar getirilemedi:", error);
    res.status(500).json({ message: "Tarlalar getirilemedi." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      name,
      location,
      latitude,
      longitude,
      areaM2,
      isGreenhouse,
      polygon,
    } = req.body;

    if (
      !userId ||
      !name ||
      !location ||
      latitude === undefined ||
      longitude === undefined ||
      !polygon ||
      !Array.isArray(polygon) ||
      polygon.length < 3
    ) {
      return res.status(400).json({
        message:
          "Kullanıcı bilgisi, tarla adı, konum, enlem, boylam ve en az 3 noktalı alan bilgisi zorunludur.",
      });
    }

    const field = await Field.create({
      userId,
      name,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      areaM2: areaM2 ? Number(areaM2) : 0,
      isGreenhouse: Boolean(isGreenhouse),
      polygon: polygon.map((point) => ({
        lat: Number(point.lat),
        lng: Number(point.lng),
      })),
    });

    res.status(201).json({
      message: "Yeni tarla bilgisi eklendi.",
      field,
    });
  } catch (error) {
    console.error("Tarla eklenemedi:", error);
    res.status(500).json({ message: "Tarla eklenemedi." });
  }
});

router.put("/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;
    const {
      userId,
      name,
      location,
      latitude,
      longitude,
      areaM2,
      isGreenhouse,
      polygon,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı bilgisi zorunludur." });
    }

    if (!name || !location || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Tarla adı, konum, enlem ve boylam zorunludur.",
      });
    }

    const updatedField = await Field.findOneAndUpdate(
      { _id: fieldId, userId },
      {
        name,
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        areaM2: areaM2 ? Number(areaM2) : 0,
        isGreenhouse: Boolean(isGreenhouse),
        polygon: Array.isArray(polygon)
          ? polygon.map((point) => ({
              lat: Number(point.lat),
              lng: Number(point.lng),
            }))
          : [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedField) {
      return res.status(404).json({ message: "Tarla bulunamadı." });
    }

    res.json({
      message: "Tarla bilgisi güncellendi.",
      updatedField,
    });
  } catch (error) {
    console.error("Tarla güncellenemedi:", error);
    res.status(500).json({ message: "Tarla güncellenemedi." });
  }
});

router.delete("/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı bilgisi zorunludur." });
    }

    const deletedField = await Field.findOneAndDelete({ _id: fieldId, userId });

    if (!deletedField) {
      return res.status(404).json({ message: "Tarla bulunamadı." });
    }

    const cropDeleteResult = await Crop.deleteMany({ fieldId, userId });

    res.json({
      message: "Tarla ve tarlaya bağlı ürün bilgileri silindi.",
      deletedFieldId: fieldId,
      deletedCropCount: cropDeleteResult.deletedCount || 0,
    });
  } catch (error) {
    console.error("Tarla silinemedi:", error);
    res.status(500).json({ message: "Tarla silinemedi." });
  }
});

module.exports = router;