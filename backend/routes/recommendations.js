const express = require('express');
const router = express.Router();

router.get('/irrigation/:fieldId', (req, res) => {
    res.json({
        message: `Tarla için sulama önerileri listelendi.`
    });
});

router.get('/alerts/:fieldId', (req, res) => {
    res.json({
        message: `Tarla için uyarılar listelendi.`
    });
});

module.exports = router;