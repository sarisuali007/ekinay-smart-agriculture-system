const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Tarla 1", location: "Isparta" },
    { id: 2, name: "Tarla 2", location: "Antalya" }
  ]);
});

router.post('/', (req, res) => {
    res.json({
        message: "Yeni tarla bilgisi eklendi."
    });
});

router.put('/:fieldId', (req, res) => {
    res.json({
        message: `Tarla bilgisi güncellendi.`
    });
});

router.delete('/:fieldId', (req, res) => {
    res.json({
        message: `Tarla bilgisi silindi.`
    });
});

module.exports = router;