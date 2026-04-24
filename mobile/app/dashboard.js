import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId, removeUserId } from "../lib/auth";

export default function DashboardScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [fieldCount, setFieldCount] = useState(0);
  const [cropCount, setCropCount] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const userId = await getUserId();

      if (!userId) {
        router.replace("/");
        return;
      }

      const { response: userResponse, data: userData } = await apiRequest(`/users/${userId}`);
      const { response: fieldResponse, data: fieldData } = await apiRequest(`/fields?userId=${userId}`);
      const { response: cropResponse, data: cropData } = await apiRequest(`/crops?userId=${userId}`);

      if (!userResponse.ok) {
        throw new Error(userData.message || "Profil alınamadı.");
      }

      if (!fieldResponse.ok) {
        throw new Error(fieldData.message || "Tarlalar alınamadı.");
      }

      if (!cropResponse.ok) {
        throw new Error(cropData.message || "Ürünler alınamadı.");
      }

      const user = userData.user || userData;

      setProfile(user);
      setFieldCount(Array.isArray(fieldData) ? fieldData.length : 0);
      setCropCount(Array.isArray(cropData) ? cropData.length : 0);
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
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
        <Text style={styles.loadingText}>Dashboard yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ekinay Dashboard</Text>
      <Text style={styles.subtitle}>
        {profile ? `Hoş geldin, ${profile.name}` : "Hoş geldin"}
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Profil Özeti</Text>
        <Text style={styles.cardText}>E-posta: {profile?.email || "-"}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Toplam Tarla</Text>
          <Text style={styles.statValue}>{fieldCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Toplam Ürün</Text>
          <Text style={styles.statValue}>{cropCount}</Text>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={loadDashboard}>
        <Text style={styles.primaryButtonText}>Verileri Yenile</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleLogout}>
        <Text style={styles.secondaryButtonText}>Çıkış Yap</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
  },
  content: {
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
    fontSize: 30,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#5b6b5f",
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5ece1",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#234b2c",
    marginBottom: 10,
  },
  cardText: {
    color: "#4b5d4f",
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5ece1",
  },
  statLabel: {
    color: "#5b6b5f",
    fontWeight: "700",
    marginBottom: 8,
  },
  statValue: {
    color: "#1f4d2a",
    fontSize: 28,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#2f6f3e",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    padding: 14,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#234b2c",
    textAlign: "center",
    fontWeight: "700",
  },
});