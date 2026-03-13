const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "Tarlalar listelendi."
    });
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