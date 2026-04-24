import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Giriş Yap" }} />
      <Stack.Screen name="register" options={{ title: "Kayıt Ol" }} />
      <Stack.Screen name="dashboard" options={{ title: "Ekinay Dashboard" }} />
      <Stack.Screen name="field-detail" options={{ title: "Tarla Detayı" }} />
      <Stack.Screen name="crop-form" options={{ title: "Ürün Formu" }} />
      <Stack.Screen name="profile" options={{ title: "Profil Ayarları" }} />
      <Stack.Screen name="field-form" options={{ title: "Tarla Formu" }} />
    </Stack>
  );
}