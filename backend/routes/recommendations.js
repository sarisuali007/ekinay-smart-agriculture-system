const express = require("express");
const router = express.Router();

const Field = require("../models/Field");
const Crop = require("../models/Crop");

const CROP_RULES = {
  domates: {
    idealTempMin: 18,
    idealTempMax: 30,
    waterNeed: "yüksek"
  },
  biber: {
    idealTempMin: 18,
    idealTempMax: 30,
    waterNeed: "orta"
  },
  salatalık: {
    idealTempMin: 18,
    idealTempMax: 32,
    waterNeed: "yüksek"
  },
  fasulye: {
    idealTempMin: 16,
    idealTempMax: 28,
    waterNeed: "orta"
  }
};

function getDaysFromSowing(sowingDate) {
  const sowDate = new Date(sowingDate);
  const now = new Date();
  const diffMs = now - sowDate;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function adjustForGreenhouse(field, weather) {
  if (!field.isGreenhouse) {
    return weather;
  }

  return {
    ...weather,
    currentTemp: weather.currentTemp + 3,
    currentHumidity: weather.currentHumidity + 8,
    currentWind: Math.max(0, weather.currentWind - 4),
    maxTemp: weather.maxTemp + 3,
    minTemp: weather.minTemp + 2
  };
}

async function fetchWeather(field) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${field.latitude}` +
    `&longitude=${field.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
    `&timezone=auto&forecast_days=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Hava verisi alınamadı.");
  }

  const data = await response.json();

  return {
    currentTemp: data.current.temperature_2m,
    currentHumidity: data.current.relative_humidity_2m,
    currentPrecipitation: data.current.precipitation,
    currentWind: data.current.wind_speed_10m,
    maxTemp: data.daily.temperature_2m_max[0],
    minTemp: data.daily.temperature_2m_min[0],
    precipitationSum: data.daily.precipitation_sum[0],
    maxWind: data.daily.wind_speed_10m_max[0]
  };
}

function buildIrrigationMessage(field, crop, weather) {
  const cropRule = CROP_RULES[crop.name];
  const daysFromSowing = getDaysFromSowing(crop.sowingDate);

  let needScore = 0;
  let reasons = [];

  if (cropRule.waterNeed === "yüksek") {
    needScore += 2;
    reasons.push("ürünün su ihtiyacı yüksek");
  } else {
    needScore += 1;
    reasons.push("ürünün su ihtiyacı orta seviyede");
  }

  if (weather.precipitationSum < 2) {
    needScore += 2;
    reasons.push("bugün beklenen yağış düşük");
  } else if (weather.precipitationSum < 6) {
    needScore += 1;
    reasons.push("yağış sınırlı");
  } else {
    reasons.push("yağış yeterli görünüyor");
  }

  if (weather.maxTemp > cropRule.idealTempMax) {
    needScore += 2;
    reasons.push("sıcaklık yüksek");
  }

  if (weather.currentHumidity < 45) {
    needScore += 1;
    reasons.push("nem düşük");
  }

  if (daysFromSowing <= 20) {
    needScore += 1;
    reasons.push("ürün erken gelişim döneminde");
  }

  if (field.isGreenhouse) {
    needScore += 1;
    reasons.push("sera ortamı sıcaklığı artırıyor");
  }

  let result = "";
  if (needScore >= 6) {
    result = "Bugün sulama önerilir.";
  } else if (needScore >= 4) {
    result = "Yakın zamanda kontrollü sulama önerilir.";
  } else {
    result = "Bugün ek sulama gerekmeyebilir.";
  }

  return `${field.name} tarlasında ${crop.name} için sulama analizi: ${result} Sebepler: ${reasons.join(", ")}.`;
}

function buildAlertMessage(field, crop, weather) {
  const cropRule = CROP_RULES[crop.name];
  let alerts = [];

  if (weather.minTemp < 5) {
    alerts.push("don / aşırı soğuk riski");
  }

  if (weather.maxTemp > cropRule.idealTempMax + 4) {
    alerts.push("yüksek sıcaklık stresi");
  }

  if (weather.maxWind > 35) {
    alerts.push("kuvvetli rüzgar riski");
  }

  if (weather.precipitationSum > 15) {
    alerts.push("şiddetli yağış riski");
  }

  if (field.isGreenhouse && weather.currentHumidity > 80) {
    alerts.push("sera içinde yüksek nem riski");
  }

  if (alerts.length === 0) {
    return `${field.name} tarlasında ${crop.name} için bugün önemli bir hava uyarısı görünmüyor.`;
  }

  return `${field.name} tarlasında ${crop.name} için uyarılar: ${alerts.join(", ")}.`;
}

router.get("/irrigation/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı bilgisi zorunludur." });
    }

    const field = await Field.findOne({ _id: fieldId, userId });
    if (!field) {
      return res.status(404).json({ message: "Tarla bulunamadı." });
    }

    const crop = await Crop.findOne({ fieldId, userId });
    if (!crop) {
      return res.status(404).json({ message: "Bu tarlaya ait ürün bulunamadı." });
    }

    const rawWeather = await fetchWeather(field);
    const weather = adjustForGreenhouse(field, rawWeather);

    const message = buildIrrigationMessage(field, crop, weather);

    res.json({
      message,
      details: {
        field,
        crop,
        weather
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Sulama önerisi üretilemedi."
    });
  }
});

router.get("/alerts/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı bilgisi zorunludur." });
    }

    const field = await Field.findOne({ _id: fieldId, userId });
    if (!field) {
      return res.status(404).json({ message: "Tarla bulunamadı." });
    }

    const crop = await Crop.findOne({ fieldId, userId });
    if (!crop) {
      return res.status(404).json({ message: "Bu tarlaya ait ürün bulunamadı." });
    }

    const rawWeather = await fetchWeather(field);
    const weather = adjustForGreenhouse(field, rawWeather);

    const message = buildAlertMessage(field, crop, weather);

    res.json({
      message,
      details: {
        field,
        crop,
        weather
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Hava uyarısı üretilemedi."
    });
  }
});

module.exports = router;