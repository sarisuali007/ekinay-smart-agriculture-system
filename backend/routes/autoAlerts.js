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
    const precipitations = weatherData?.minutely_15?.precipitation || [];
    const windGusts = weatherData?.minutely_15?.wind_gusts_10m || [];

    // İlk 2 slot yaklaşık 30 dakikalık pencere demektir.
    for (let i = 0; i < Math.min(2, times.length); i++) {
        const slotTime = times[i];
        const temp = temps[i] ?? 99;
        const precipitation = precipitations[i] ?? 0;
        const windGust = windGusts[i] ?? 0;

        if (temp <= 2) {
            return {
                type: "freeze",
                slotKey: slotTime,
                title: `${field.name} için don riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde don riski görünüyor. Bitkiyi korumak için önlem almanız önerilir.`
            };
        }

        if (windGust >= 75 && precipitation >= 3) {
            return {
                type: "severe_storm",
                slotKey: slotTime,
                title: `${field.name} için şiddetli fırtına riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde çok kuvvetli rüzgar ve yağış riski görünüyor. Sera, fide ve açıkta kalan ekipmanları kontrol edin.`
            };
        }

        if (windGust >= 60) {
            return {
                type: "storm",
                slotKey: slotTime,
                title: `${field.name} için fırtına riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde kuvvetli rüzgar riski görünüyor. Tarla ve sera çevresini kontrol etmeniz önerilir.`
            };
        }

        if (precipitation >= 8) {
            return {
                type: "heavy_rain",
                slotKey: slotTime,
                title: `${field.name} için ani yağış riski`,
                body: `${crop.name} ekili tarlada yaklaşık 30 dakika içinde yoğun yağış riski görünüyor. Su birikmesi ve drenaj durumunu kontrol edin.`
            };
        }

        if (temp >= 32 && precipitation === 0) {
            return {
                type: "drought_stress",
                slotKey: slotTime,
                title: `${field.name} için kuraklık stresi`,
                body: `${crop.name} ekili tarlada yüksek sıcaklık ve yağışsız hava nedeniyle kuraklık stresi oluşabilir. Sulama planını kontrol edin.`
            };
        }
    }

    return null;
}

async function sendExpoPush(expoPushToken, payload) {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            to: expoPushToken,
            sound: "default",
            title: payload.title,
            body: payload.body,
            data: payload.data
        })
    });

    return await response.json();
}

function getSecretFromRequest(req) {
    const secretFromHeader = (req.headers["x-auto-alert-secret"] || "").trim();
    const secretFromQuery = (req.query.secret || "").trim();

    return secretFromHeader || secretFromQuery;
}

router.post("/run", async (req, res) => {
    try {
        const secret = getSecretFromRequest(req);

        if (secret !== AUTO_ALERT_SECRET) {
            return res.status(403).json({ message: "Yetkisiz istek." });
        }

        const users = await User.find({
            expoPushToken: { $exists: true, $ne: "" },
            pushAlertsEnabled: true
        });

        let checkedUserCount = 0;
        let checkedFieldCount = 0;
        let skippedNoCropCount = 0;
        let noRiskCount = 0;
        let alreadySentCount = 0;
        let sentCount = 0;
        let failedPushCount = 0;

        for (const user of users) {
            checkedUserCount += 1;

            const fields = await Field.find({ userId: user._id });
            const crops = await Crop.find({ userId: user._id });

            for (const field of fields) {
                checkedFieldCount += 1;

                const crop = crops.find(
                    (item) => String(item.fieldId) === String(field._id)
                );

                if (!crop) {
                    skippedNoCropCount += 1;
                    continue;
                }

                const weather = await fetchShortWindowWeather(field);
                const risk = detectUpcomingRisk(field, crop, weather);

                if (!risk) {
                    noRiskCount += 1;
                    continue;
                }

                const alreadySent = await AutoAlertLog.findOne({
                    userId: user._id,
                    fieldId: field._id,
                    alertType: risk.type,
                    slotKey: risk.slotKey
                });

                if (alreadySent) {
                    alreadySentCount += 1;
                    continue;
                }

                const expoResponse = await sendExpoPush(user.expoPushToken, {
                    title: risk.title,
                    body: risk.body,
                    data: {
                        url: `/field-detail?id=${field._id}`,
                        fieldId: field._id,
                        alertType: risk.type
                    }
                });

                const expoStatus = expoResponse?.data?.status;

                if (expoStatus === "error") {
                    failedPushCount += 1;
                    continue;
                }

                await AutoAlertLog.create({
                    userId: user._id,
                    fieldId: field._id,
                    alertType: risk.type,
                    slotKey: risk.slotKey
                });

                sentCount += 1;
            }
        }

        res.json({
            message: "Otomatik tarama tamamlandı.",
            summary: {
                checkedUserCount,
                checkedFieldCount,
                skippedNoCropCount,
                noRiskCount,
                alreadySentCount,
                failedPushCount,
                sentCount
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Otomatik uyarı taraması başarısız."
        });
    }
});

module.exports = router;