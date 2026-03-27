const express = require('express');
const router = express.Router();

router.put('/:userId', (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    res.json({
        message: `Kullanıcı ${userId} bilgileri güncellendi.`,
        updatedUser: {
            id: userId,
            name,
            email,
            password
        }
    });
});

module.exports = router;