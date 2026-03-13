const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.json({
        message: "Yeni ürün bilgisi eklendi."
    });
});

router.put('/:cropId', (req, res) => {
    res.json({
        message: `Ürün bilgisi güncellendi.`
    });
});

router.delete('/:cropId', (req, res) => {
    res.json({
        message: `Ürün bilgisi silindi.`
    });
});

module.exports = router;