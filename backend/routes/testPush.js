const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Field = require("../models/Field");

const TEST_PUSH_SECRET = (process.env.AUTO_ALERT_SECRET || "ekinay-secret").trim();

async function sendExpoPush(expoPushToken, payload) {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }),
  });

  return await response.json();
}

router.post("/run", async (req, res) => {
  try {
    const secretFromHeader = (req.headers["x-auto-alert-secret"] || "").trim();
    const secretFromQuery = (req.query.secret || "").trim();
    const secret = secretFromHeader || secretFromQuery;

    if (secret !== TEST_PUSH_SECRET) {
      return res.status(403).json({ message: "Yetkisiz istek." });
    }

    const users = await User.find({
      expoPushToken: { $exists: true, $ne: "" },
      pushAlertsEnabled: true,
    });

    if (!users.length) {
      return res.status(404).json({ message: "Push token kayıtlı kullanıcı bulunamadı." });
    }

    const user = users[0];
    const field = await Field.findOne({ userId: user._id });

    if (!field) {
      return res.status(404).json({ message: "Test için tarla bulunamadı." });
    }

    const expoResponse = await sendExpoPush(user.expoPushToken, {
      title: "Ekinay Test Bildirimi",
      body: `${field.name} tarlası için test bildirimi gönderildi.`,
      data: {
        url: `/field-detail?id=${field._id}`,
        fieldId: field._id,
        alertType: "test_push",
      },
    });

    res.json({
      message: "Test bildirimi gönderildi.",
      userId: user._id,
      fieldId: field._id,
      expoResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Test bildirimi gönderilemedi.",
    });
  }
});

module.exports = router;