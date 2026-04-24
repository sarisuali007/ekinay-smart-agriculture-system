import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId, saveUserId } from "../lib/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const savedUserId = await getUserId();

      if (savedUserId) {
        router.replace("/dashboard");
        return;
      }

      setCheckingSession(false);
    }

    checkSession();
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);

      const { response, data } = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(data.message || "Giriş başarısız.");
      }

      const userId = data.user?._id;
      await saveUserId(userId);

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f6f3e" />
        <Text style={styles.loadingText}>Oturum kontrol ediliyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ekinay</Text>
      <Text style={styles.subtitle}>Hesabına giriş yap</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#7a8a7e"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#7a8a7e"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.primaryButtonText}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Text>
      </Pressable>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Üye değil misin?</Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.registerLink}> Kayıt Ol</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
    justifyContent: "center",
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f4f7f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#5b6b5f",
    fontSize: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#5b6b5f",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    color: "#1f2937",
  },
  primaryButton: {
    backgroundColor: "#2f6f3e",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  registerText: {
    color: "#5b6b5f",
    fontSize: 14,
  },
  registerLink: {
    color: "#2f6f3e",
    fontSize: 14,
    fontWeight: "700",
  },
});