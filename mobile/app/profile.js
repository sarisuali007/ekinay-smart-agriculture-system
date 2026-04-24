import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId, removeUserId } from "../lib/auth";

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const savedUserId = await getUserId();

      if (!savedUserId) {
        router.replace("/");
        return;
      }

      setUserId(savedUserId);

      const { response, data } = await apiRequest(`/users/${savedUserId}`);

      if (!response.ok) {
        throw new Error(data.message || "Profil bilgileri alınamadı.");
      }

      const user = data.user || data;

      setName(user.name || "");
      setEmail(user.email || "");
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      setSaving(true);

      if (!userId) {
        throw new Error("Kullanıcı bilgisi bulunamadı.");
      }

      const payload = {
        name,
        email,
      };

      if (password.trim()) {
        payload.password = password;
      }

      const { response, data } = await apiRequest(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(data.message || "Profil güncellenemedi.");
      }

      setPassword("");
      Alert.alert("Başarılı", data.message || "Profil güncellendi.");
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      if (!userId) {
        throw new Error("Kullanıcı bilgisi bulunamadı.");
      }

      const { response, data } = await apiRequest(`/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(data.message || "Hesap silinemedi.");
      }

      await removeUserId();
      Alert.alert("Başarılı", data.message || "Hesap silindi.");
      router.replace("/");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  }

  async function handleLogout() {
    await removeUserId();
    router.replace("/");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f6f3e" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Ayarları</Text>
      <Text style={styles.subtitle}>Hesap bilgilerini buradan düzenleyebilirsin.</Text>

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
        placeholder="Yeni Şifre (zorunlu değil)"
        placeholderTextColor="#7a8a7e"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.primaryButton} onPress={handleUpdate} disabled={saving}>
        <Text style={styles.primaryButtonText}>
          {saving ? "Kaydediliyor..." : "Profili Güncelle"}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleLogout}>
        <Text style={styles.secondaryButtonText}>Çıkış Yap</Text>
      </Pressable>

      <Pressable style={styles.dangerButton} onPress={handleDelete}>
        <Text style={styles.dangerButtonText}>Hesabı Sil</Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#5b6b5f",
    marginBottom: 22,
    lineHeight: 22,
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
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#234b2c",
    fontSize: 16,
    fontWeight: "700",
  },
  dangerButton: {
    backgroundColor: "#9b2c2c",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  dangerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});