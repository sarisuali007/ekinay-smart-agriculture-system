const express = require('express');
const router = express.Router();

router.get('/irrigation/:fieldId', (req, res) => {
    const { fieldId } = req.params;

    res.json({
        message: `Tarla ${fieldId} için sulama önerisi: Yarın sabah sulama yapın.`
    });
});

router.get('/alerts/:fieldId', (req, res) => {
    const { fieldId } = req.params;

    res.json({
        message: `Tarla ${fieldId} için hava uyarısı: Gece don riski var.`
    });
});

module.exports = router;