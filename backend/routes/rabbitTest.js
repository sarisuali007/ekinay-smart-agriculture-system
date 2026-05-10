const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Field = require("../models/Field");
const { publishAlertMessage } = require("../services/rabbitmqService");

const RABBIT_TEST_SECRET = (process.env.AUTO_ALERT_SECRET || "ekinay-secret").trim();

function getSecretFromRequest(req) {
    const secretFromHeader = (req.headers["x-auto-alert-secret"] || "").trim();
    const secretFromQuery = (req.query.secret || "").trim();

    return secretFromHeader || secretFromQuery;
}

router.post("/push", async (req, res) => {
    try {
        const secret = getSecretFromRequest(req);

        if (secret !== RABBIT_TEST_SECRET) {
            return res.status(403).json({ message: "Yetkisiz istek." });
        }

        const userId = req.query.userId;

        const user = userId
            ? await User.findById(userId)
            : await User.findOne({
                expoPushToken: { $exists: true, $ne: "" },
                pushAlertsEnabled: true
            });

        if (!user || !user.expoPushToken) {
            return res.status(404).json({
                message: "Push token kayıtlı kullanıcı bulunamadı."
            });
        }

        const field = await Field.findOne({ userId: user._id });

        const fieldName = field ? field.name : "Ekinay";
        const fieldId = field ? field._id : null;

        const rabbitMessage = {
            expoPushToken: user.expoPushToken,
            title: "Ekinay RabbitMQ Test Bildirimi",
            body: `${fieldName} için RabbitMQ kuyruğu üzerinden test bildirimi gönderildi.`,
            data: {
                url: fieldId ? `/field-detail?id=${fieldId}` : "/dashboard",
                fieldId,
                alertType: "rabbitmq_test"
            }
        };

        const publishResult = await publishAlertMessage(rabbitMessage);

        res.json({
            message: "Bildirim mesajı RabbitMQ kuyruğuna gönderildi.",
            userId: user._id,
            fieldId,
            queue: publishResult.queue,
            published: publishResult.published
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "RabbitMQ test bildirimi kuyruğa gönderilemedi."
        });
    }
});

module.exports = router;