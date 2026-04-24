const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Field = require("../models/Field");
const Crop = require("../models/Crop");
const AutoAlertLog = require("../models/AutoAlertLog");

const AUTO_ALERT_SECRET = (process.env.AUTO_ALERT_SECRET || "ekinay-secret").trim();

async function fetchShortWindowWeather(field) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${field.latitude}` +
        `&longitude=${field.longitude}` +
        `&minutely_15=temperature_2m,precipitation,wind_gusts_10m` +
        `&forecast_minutely_15=4&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Kısa pencere hava verisi alınamadı.");
    }

    return await response.json();
}

function detectUpcomingRisk(field, crop, weatherData) {
    const times = weatherData?.minutely_15?.time || [];
    const temps = weatherData?.minutely_15?.temperature_2m || [];
    const precs = weatherData?.minutely_15?.precipitation || [];
    const gusts = weatherData?.minutely_15?.wind_gusts_10m || [];

    // İlk 2 slot = yaklaşık 30 dakika pencere
    for (let i = 0; i < Math.min(2, times.length); i++) {
        const slotTime = times[i];
        const temp = temps[i] ?? 99;
        const precipitation = precs[i] ?? 0;
        const windGust = gusts[i] ?? 0;

        if (temp <= 2) {
            return {
                type: "freeze",
                slotKey: slotTime,
                title: `${field.name} için don riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde don riski görünüyor.`,
            };
        }

        if (windGust >= 60) {
            return {
                type: "storm",
                slotKey: slotTime,
                title: `${field.name} için şiddetli rüzgar riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde şiddetli rüzgar/fırtına riski görünüyor.`,
            };
        }

        if (precipitation >= 8) {
            return {
                type: "heavy_rain",
                slotKey: slotTime,
                title: `${field.name} için ani yağış riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde ani yağış riski görünüyor.`,
            };
        }

        // Kuraklık stresi: kısa pencere + sıcaklık
        if (temp >= 32 && precipitation === 0) {
            return {
                type: "drought_stress",
                slotKey: slotTime,
                title: `${field.name} için kuraklık stresi`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde yüksek sıcaklık ve kuraklık stresi riski görünüyor.`,
            };
        }
    }

    return null;
}

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

        if (secret !== AUTO_ALERT_SECRET) {
            return res.status(403).json({ message: "Yetkisiz istek." });
        }

        const users = await User.find({
            expoPushToken: { $exists: true, $ne: "" },
            pushAlertsEnabled: true,
        });

        let sentCount = 0;

        for (const user of users) {
            console.log("AUTO ALERT USER =", user.email, user._id);
            console.log("AUTO ALERT PUSH TOKEN =", user.expoPushToken);
            console.log("AUTO ALERT PUSH ENABLED =", user.pushAlertsEnabled);

            const fields = await Field.find({ userId: user._id });
            const crops = await Crop.find({ userId: user._id });

            console.log("AUTO ALERT FIELD COUNT =", fields.length);
            console.log("AUTO ALERT CROP COUNT =", crops.length);

            for (const field of fields) {
                console.log("CHECKING FIELD =", field.name, field._id);

                const crop = crops.find((item) => String(item.fieldId) === String(field._id));

                if (!crop) {
                    console.log("SKIP: NO CROP FOR FIELD =", field.name);
                    continue;
                }

                console.log("MATCHED CROP =", crop.name, crop._id);

                const weather = await fetchShortWindowWeather(field);
                console.log("SHORT WEATHER =", JSON.stringify(weather?.minutely_15 || {}));

                const risk = detectUpcomingRisk(field, crop, weather);
                console.log("DETECTED RISK =", JSON.stringify(risk));

                if (!risk) {
                    console.log("SKIP: NO RISK FOR FIELD =", field.name);
                    continue;
                }

                const alreadySent = await AutoAlertLog.findOne({
                    userId: user._id,
                    fieldId: field._id,
                    alertType: risk.type,
                    slotKey: risk.slotKey,
                });

                console.log("ALREADY SENT =", !!alreadySent);

                if (alreadySent) {
                    console.log("SKIP: ALREADY SENT =", field.name, risk.type, risk.slotKey);
                    continue;
                }

                console.log("SENDING PUSH TO =", user.expoPushToken);

                await sendExpoPush(user.expoPushToken, {
                    title: risk.title,
                    body: risk.body,
                    data: {
                        url: `/field-detail?id=${field._id}`,
                        fieldId: field._id,
                        alertType: risk.type,
                    },
                });

                await AutoAlertLog.create({
                    userId: user._id,
                    fieldId: field._id,
                    alertType: risk.type,
                    slotKey: risk.slotKey,
                });

                console.log("PUSH SENT =", field.name, risk.type, risk.slotKey);

                sentCount += 1;
            }
        }

        res.json({ message: "Otomatik tarama tamamlandı.", sentCount });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Otomatik uyarı taraması başarısız.",
        });
    }
});

module.exports = router;