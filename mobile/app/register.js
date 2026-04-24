import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "../lib/api";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);

      const { response, data } = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error(data.message || "Kayıt başarısız.");
      }

      Alert.alert("Başarılı", data.message || "Kayıt başarılı.");
      router.replace("/");
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <Text style={styles.subtitle}>Yeni hesabını oluştur</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        placeholderTextColor="#7a8a7e"
        value={name}
        onChangeText={setName}
      />

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

      <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.primaryButtonText}>
          {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
        </Text>
      </Pressable>
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
  title: {
    fontSize: 30,
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
});