const express = require('express');
const router = express.Router();

router.post("/register", (req, res) => {
    res.json({
        message: "Kayıt işlemi başarılı!"
    });
});

router.post("/login", (req, res) => {
    res.json({
        message: "Giriş işlemi başarılı!"
    });
});

module.exports = router;

