const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
    const { name, fieldId } = req.body;

    res.json({
        message: "Yeni ürün bilgisi eklendi.",
        crop: {
            name,
            fieldId
        }
    });
});

router.put("/:cropId", (req, res) => {
    const { cropId } = req.params;
    const { name, fieldId } = req.body;

    res.json({
        message: "Ürün bilgisi güncellendi.",
        updatedCrop: {
            id: cropId,
            name,
            fieldId
        }
    });
});

router.delete("/:cropId", (req, res) => {
    const { cropId } = req.params;

    res.json({
        message: `Ürün ${cropId} silindi.`
    });
});

module.exports = router;