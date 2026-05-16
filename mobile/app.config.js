const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

module.exports = {
  expo: {
    name: "Ekinay",
    slug: "mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ekinay",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#F3F8EF"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.ekinay.mobile",
      versionCode: 5,
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#F3F8EF"
      },
      permissions: [
        "POST_NOTIFICATIONS",
        "SCHEDULE_EXACT_ALARM"
      ],
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-notifications"
    ],
    extra: {
      eas: {
        projectId: "e3c7c4cc-2185-4fea-9733-9e4b6c861c0d"
      }
    }
  }
};