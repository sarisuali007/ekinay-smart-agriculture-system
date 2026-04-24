import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId, removeUserId } from "../lib/auth";

const CROP_PROFILES = {
  domates: { daysToHarvest: 70 },
  biber: { daysToHarvest: 78 },
  salatalık: { daysToHarvest: 55 },
  fasulye: { daysToHarvest: 55 },
};

function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function estimateHarvestDate(sowingDate, cropName) {
  const profile = CROP_PROFILES[cropName];
  if (!profile || !sowingDate) return "-";

  const harvest = new Date(sowingDate);
  harvest.setDate(harvest.getDate() + profile.daysToHarvest);

  return formatDate(harvest);
}

function getCropForField(fieldId, crops) {
  return crops.find((crop) => {
    const cropFieldId =
      typeof crop.fieldId === "object" ? crop.fieldId._id : crop.fieldId;
    return cropFieldId === fieldId;
  });
}

export default function DashboardScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [fieldCount, setFieldCount] = useState(0);
  const [cropCount, setCropCount] = useState(0);
  const [fieldCards, setFieldCards] = useState([]);

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
      const fields = Array.isArray(fieldData) ? fieldData : [];
      const crops = Array.isArray(cropData) ? cropData : [];

      setProfile(user);
      setFieldCount(fields.length);
      setCropCount(crops.length);

      const cards = await Promise.all(
        fields.map(async (field) => {
          const crop = getCropForField(field._id, crops);

          let irrigationMessage = "Bu tarlada ürün olmadığı için sulama önerisi yok.";
          let alertMessage = "Bu tarlada ürün olmadığı için hava uyarısı yok.";
          let harvestDate = "-";

          if (crop) {
            harvestDate = estimateHarvestDate(crop.sowingDate, crop.name);

            try {
              const { response: irrigationResponse, data: irrigationData } =
                await apiRequest(`/recommendations/irrigation/${field._id}?userId=${userId}`);

              if (irrigationResponse.ok) {
                irrigationMessage = irrigationData.message || irrigationMessage;

                if (irrigationData.agronomy?.harvestDate) {
                  harvestDate = formatDate(irrigationData.agronomy.harvestDate);
                }
              }
            } catch {
              irrigationMessage = "Sulama bilgisi alınamadı.";
            }

            try {
              const { response: alertResponse, data: alertData } =
                await apiRequest(`/recommendations/alerts/${field._id}?userId=${userId}`);

              if (alertResponse.ok) {
                alertMessage = alertData.message || alertMessage;
              }
            } catch {
              alertMessage = "Hava uyarısı alınamadı.";
            }
          }

          return {
            ...field,
            cropName: crop ? crop.name : "Henüz ürün yok",
            sowingDate: crop ? formatDate(crop.sowingDate) : "-",
            harvestDate,
            irrigationMessage,
            alertMessage,
          };
        })
      );

      setFieldCards(cards);
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

      <Text style={styles.sectionTitle}>Tarlalarım</Text>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/field-form")}
      >
        <Text style={styles.secondaryButtonText}>Yeni Tarla Ekle</Text>
      </Pressable>

      {fieldCards.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Henüz kayıtlı tarla bulunmuyor.</Text>
        </View>
      ) : (
        fieldCards.map((field) => (
          <Pressable
            key={field._id}
            style={styles.fieldCard}
            onPress={() => router.push(`/field-detail?id=${field._id}`)}
          >
            <View style={styles.badgeRow}>
              <Text style={styles.fieldBadge}>
                {field.isGreenhouse ? "Sera" : "Açık Alan"}
              </Text>
            </View>

            <Text style={styles.fieldTitle}>{field.name}</Text>
            <Text style={styles.fieldText}>Konum: {field.location}</Text>
            <Text style={styles.fieldText}>Alan: {field.areaM2 || 0} m²</Text>
            <Text style={styles.fieldText}>Ürün: {field.cropName}</Text>
            <Text style={styles.fieldText}>Ekim Tarihi: {field.sowingDate}</Text>
            <Text style={styles.fieldText}>Tahmini Hasat: {field.harvestDate}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Bugünün Sulama Özeti</Text>
              <Text style={styles.infoText}>{field.irrigationMessage}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Hava Uyarısı</Text>
              <Text style={styles.infoText}>{field.alertMessage}</Text>
            </View>

            <Text style={styles.detailHint}>Detayı açmak için karta dokun.</Text>
          </Pressable>
        ))
      )}

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/profile")}
      >
        <Text style={styles.secondaryButtonText}>Profil Ayarlarına Git</Text>
      </Pressable>

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
    paddingBottom: 40,
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
    marginBottom: 22,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5ece1",
    marginBottom: 20,
  },
  emptyText: {
    color: "#5b6b5f",
    fontSize: 15,
  },
  fieldCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5ece1",
    marginBottom: 16,
  },
  badgeRow: {
    marginBottom: 8,
  },
  fieldBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eef6ed",
    color: "#2f6f3e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "700",
    fontSize: 12,
    overflow: "hidden",
  },
  fieldTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 10,
  },
  fieldText: {
    color: "#4b5d4f",
    lineHeight: 22,
    marginBottom: 4,
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: "#f7faf6",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    padding: 14,
  },
  infoTitle: {
    color: "#234b2c",
    fontWeight: "700",
    marginBottom: 8,
  },
  infoText: {
    color: "#4b5d4f",
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#2f6f3e",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#234b2c",
    textAlign: "center",
    fontWeight: "700",
  },

  detailHint: {
    marginTop: 12,
    color: "#2f6f3e",
    fontWeight: "700",
    fontSize: 13,
  },
});