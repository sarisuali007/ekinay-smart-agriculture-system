const express = require("express");
const router = express.Router();

const Field = require("../models/Field");
const Crop = require("../models/Crop");

const CROP_PROFILES = {
  domates: {
    displayName: "Domates",
    daysToHarvest: 70,
    idealTempMin: 18,
    idealTempMax: 30,
    waterNeed: "high",
    stages: [
      { name: "Çimlenme ve Köklenme", start: 0, end: 10, irrigation: "medium" },
      { name: "Vejetatif Gelişim", start: 11, end: 25, irrigation: "medium" },
      { name: "Çiçeklenme", start: 26, end: 40, irrigation: "high" },
      { name: "Meyve Bağlama", start: 41, end: 55, irrigation: "high" },
      { name: "Olgunlaşma", start: 56, end: 70, irrigation: "medium" }
    ]
  },
  biber: {
    displayName: "Biber",
    daysToHarvest: 78,
    idealTempMin: 18,
    idealTempMax: 30,
    waterNeed: "medium",
    stages: [
      { name: "Çimlenme ve Köklenme", start: 0, end: 12, irrigation: "medium" },
      { name: "Vejetatif Gelişim", start: 13, end: 30, irrigation: "medium" },
      { name: "Çiçeklenme", start: 31, end: 48, irrigation: "high" },
      { name: "Meyve Gelişimi", start: 49, end: 65, irrigation: "high" },
      { name: "Olgunlaşma", start: 66, end: 78, irrigation: "medium" }
    ]
  },
  salatalık: {
    displayName: "Salatalık",
    daysToHarvest: 55,
    idealTempMin: 18,
    idealTempMax: 32,
    waterNeed: "high",
    stages: [
      { name: "Çimlenme", start: 0, end: 7, irrigation: "medium" },
      { name: "Hızlı Vejetatif Gelişim", start: 8, end: 20, irrigation: "high" },
      { name: "Çiçeklenme", start: 21, end: 32, irrigation: "high" },
      { name: "Meyve Dönemi", start: 33, end: 45, irrigation: "high" },
      { name: "Hasat Yaklaşımı", start: 46, end: 55, irrigation: "medium" }
    ]
  },
  fasulye: {
    displayName: "Fasulye",
    daysToHarvest: 55,
    idealTempMin: 16,
    idealTempMax: 28,
    waterNeed: "medium",
    stages: [
      { name: "Çimlenme", start: 0, end: 7, irrigation: "medium" },
      { name: "Vejetatif Gelişim", start: 8, end: 20, irrigation: "medium" },
      { name: "Çiçeklenme", start: 21, end: 35, irrigation: "high" },
      { name: "Bakla Bağlama", start: 36, end: 47, irrigation: "high" },
      { name: "Olgunlaşma", start: 48, end: 55, irrigation: "low" }
    ]
  }
};

function getDaysFromSowing(sowingDate) {
  const sowDate = new Date(sowingDate);
  const now = new Date();
  const diffMs = now - sowDate;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function estimateHarvestDate(sowingDate, cropName) {
  const profile = CROP_PROFILES[cropName];
  const base = new Date(sowingDate);
  const harvest = new Date(base);
  harvest.setDate(harvest.getDate() + profile.daysToHarvest);
  return harvest;
}

function getStageForDay(cropName, dayIndex) {
  const profile = CROP_PROFILES[cropName];
  return profile.stages.find(stage => dayIndex >= stage.start && dayIndex <= stage.end) || profile.stages.at(-1);
}

function toISODateOnly(date) {
  return new Date(date).toISOString().split("T")[0];
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
    minTemp: weather.minTemp + 2,
    dailySeries: (weather.dailySeries || []).map(day => ({
      ...day,
      maxTemp: (day.maxTemp ?? 0) + 3,
      minTemp: (day.minTemp ?? 0) + 2,
      currentHumidity: (day.currentHumidity ?? 60) + 8,
      maxWind: Math.max(0, (day.maxWind ?? 0) - 4)
    }))
  };
}

async function fetchWeather(field) {
  if (field.latitude === undefined || field.longitude === undefined) {
    throw new Error("Tarla koordinat bilgisi eksik.");
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${field.latitude}` +
    `&longitude=${field.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
    `&timezone=auto&forecast_days=16`;

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
    maxTemp: data.daily.temperature_2m_max?.[0],
    minTemp: data.daily.temperature_2m_min?.[0],
    precipitationSum: data.daily.precipitation_sum?.[0],
    maxWind: data.daily.wind_speed_10m_max?.[0],
    dailySeries: (data.daily.time || []).map((day, index) => ({
      date: day,
      maxTemp: data.daily.temperature_2m_max?.[index],
      minTemp: data.daily.temperature_2m_min?.[index],
      precipitationSum: data.daily.precipitation_sum?.[index],
      maxWind: data.daily.wind_speed_10m_max?.[index],
      currentHumidity: data.current.relative_humidity_2m
    }))
  };
}

function buildIrrigationMessage(field, crop, weather) {
  const profile = CROP_PROFILES[crop.name];
  const daysFromSowing = getDaysFromSowing(crop.sowingDate);

  let needScore = 0;
  const reasons = [];

  if (profile.waterNeed === "high") {
    needScore += 2;
    reasons.push("ürünün su ihtiyacı yüksek");
  } else {
    needScore += 1;
    reasons.push("ürünün su ihtiyacı orta seviyede");
  }

  if ((weather.precipitationSum ?? 0) < 2) {
    needScore += 2;
    reasons.push("beklenen yağış düşük");
  } else if ((weather.precipitationSum ?? 0) < 6) {
    needScore += 1;
    reasons.push("yağış sınırlı");
  } else {
    reasons.push("yağış yeterli görünüyor");
  }

  if ((weather.maxTemp ?? 0) > profile.idealTempMax) {
    needScore += 2;
    reasons.push("sıcaklık yüksek");
  }

  if ((weather.currentHumidity ?? 60) < 45) {
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
    result = "Bugün sulama yapılması önerilir.";
  } else if (needScore >= 4) {
    result = "Kontrollü ve kısa süreli sulama planı düşünülmelidir.";
  } else {
    result = "Bugün ek sulama ihtiyacı düşük görünüyor.";
  }

  return `${field.name} tarlasında ekili ${crop.name} için değerlendirme: ${result} Başlıca nedenler: ${reasons.join(", ")}.`;
}

function buildAlertMessage(field, crop, weather) {
  const profile = CROP_PROFILES[crop.name];
  const alerts = [];

  if ((weather.minTemp ?? 99) < 5) {
    alerts.push("don / aşırı soğuk riski");
  }

  if ((weather.maxTemp ?? 0) > profile.idealTempMax + 4) {
    alerts.push("yüksek sıcaklık stresi");
  }

  if ((weather.maxWind ?? 0) > 35) {
    alerts.push("kuvvetli rüzgar riski");
  }

  if ((weather.precipitationSum ?? 0) > 15) {
    alerts.push("şiddetli yağış riski");
  }

  if (field.isGreenhouse && (weather.currentHumidity ?? 0) > 80) {
    alerts.push("sera içinde yüksek nem riski");
  }

  if (!alerts.length) {
    return `${field.name} tarlasında ekili ${crop.name} için bugün dikkat gerektiren önemli bir hava riski görünmüyor.`;
  }

  return `${field.name} tarlasında ekili ${crop.name} için dikkat edilmesi gereken durumlar: ${alerts.join(", ")}.`;
}

function decideDailyIrrigation(profile, stage, field, weatherForDay, relativeDay) {
  let score = 0;

  if (stage.irrigation === "high") score += 2;
  if (stage.irrigation === "medium") score += 1;
  if (field.isGreenhouse) score += 1;

  if (weatherForDay) {
    if ((weatherForDay.maxTemp ?? 0) > profile.idealTempMax) score += 2;
    if ((weatherForDay.minTemp ?? 0) < profile.idealTempMin - 3) score -= 1;
    if ((weatherForDay.precipitationSum ?? 0) < 2) score += 1;
    if ((weatherForDay.precipitationSum ?? 0) > 8) score -= 2;
    if ((weatherForDay.currentHumidity ?? 60) < 45) score += 1;
  } else {
    if (stage.irrigation === "high") score += 1;
  }

  if (relativeDay <= 16) {
    if (score >= 4) return "Sulama gerekiyor";
    if (score >= 2) return "Kontrollü sulama";
    return "Sulama gerekmiyor";
  }

  if (score >= 3) return "Sulama gerekiyor";
  if (score >= 1) return "Kontrollü sulama";
  return "Sulama gerekmiyor";
}

function buildSeasonCalendar(field, crop, weather) {
  const profile = CROP_PROFILES[crop.name];
  const sowingDate = new Date(crop.sowingDate);
  const harvestDate = estimateHarvestDate(crop.sowingDate, crop.name);

  const calendar = [];
  const totalDays = profile.daysToHarvest;

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(sowingDate);
    currentDate.setDate(currentDate.getDate() + i);

    const stage = getStageForDay(crop.name, i);
    let weatherForDay = null;

    if (weather?.dailySeries && i < weather.dailySeries.length) {
      weatherForDay = weather.dailySeries[i];
    }

    const irrigation = decideDailyIrrigation(profile, stage, field, weatherForDay, i);

    calendar.push({
      dayIndex: i,
      date: toISODateOnly(currentDate),
      stage: stage.name,
      irrigation
    });
  }

  return {
    harvestDate: toISODateOnly(harvestDate),
    totalDays,
    seasonCalendar: calendar
  };
}

async function buildRecommendationPayload(field, crop) {
  const rawWeather = await fetchWeather(field);
  const weather = adjustForGreenhouse(field, rawWeather);

  return {
    weather,
    irrigationMessage: buildIrrigationMessage(field, crop, weather),
    alertMessage: buildAlertMessage(field, crop, weather),
    agronomy: buildSeasonCalendar(field, crop, weather)
  };
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

    const payload = await buildRecommendationPayload(field, crop);

    res.json({
      message: payload.irrigationMessage,
      details: {
        field,
        crop,
        weather: payload.weather
      },
      agronomy: payload.agronomy
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

    const payload = await buildRecommendationPayload(field, crop);

    res.json({
      message: payload.alertMessage,
      details: {
        field,
        crop,
        weather: payload.weather
      },
      agronomy: payload.agronomy
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Hava uyarısı üretilemedi."
    });
  }
});

module.exports = router;