import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Giriş Yap" }} />
      <Stack.Screen name="register" options={{ title: "Kayıt Ol" }} />
      <Stack.Screen name="dashboard" options={{ title: "Ekinay Dashboard" }} />
    </Stack>
  );
}