const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Tarla 1", location: "Isparta" },
    { id: 2, name: "Tarla 2", location: "Antalya" }
  ]);
});

router.post('/', (req, res) => {
    const { name, location } = req.body;

    res.json({
        message: "Yeni tarla bilgisi eklendi.",
        field: {
            name,
            location
        }
    });
});

router.put('/:fieldId', (req, res) => {
    const { fieldId } = req.params;
    const { name, location } = req.body;

    res.json({
        message: "Tarla bilgisi güncellendi.",
        updatedField: {
            id: fieldId,
            name,
            location
        }
    });
});

router.delete('/:fieldId', (req, res) => {
    const { fieldId } = req.params;

    res.json({
        message: `Tarla ${fieldId} silindi.`
    });
});

module.exports = router;