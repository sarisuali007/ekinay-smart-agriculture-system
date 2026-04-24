import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { apiRequest } from "./api";
import { getUserId } from "./auth";

export async function registerAndSyncPushToken() {
  const userId = await getUserId();
  if (!userId) return null;

  if (!Device.isDevice) {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Bildirim izni verilmedi.");
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Expo projectId bulunamadı.");
  }

  const expoPushToken = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;

  const { response, data } = await apiRequest(`/users/${userId}/push-token`, {
    method: "PUT",
    body: JSON.stringify({
      expoPushToken,
      pushAlertsEnabled: true,
    }),
  });

  if (!response.ok) {
    throw new Error(data.message || "Push token kaydedilemedi.");
  }

  return expoPushToken;
}