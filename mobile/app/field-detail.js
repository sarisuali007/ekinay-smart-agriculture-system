import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId } from "../lib/auth";
import {
  addSeasonPlanToCalendar,
  clearEkinayCalendar,
} from "../lib/calendar";
import {
  scheduleSeasonNotifications,
  clearSeasonNotificationsForField,
} from "../lib/notifications";

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

function groupSeasonCalendarByMonth(calendar) {
  const grouped = {};

  calendar.forEach((item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(item);
  });

  return grouped;
}

function getTodayDateOnly() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
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

export default function FieldDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [field, setField] = useState(null);
  const [crop, setCrop] = useState(null);
  const [irrigationMessage, setIrrigationMessage] = useState("-");
  const [alertMessage, setAlertMessage] = useState("-");
  const [harvestDate, setHarvestDate] = useState("-");
  const [seasonCalendar, setSeasonCalendar] = useState([]);

  useEffect(() => {
    loadFieldDetail();
  }, [id]);

  async function loadFieldDetail() {
    try {
      setLoading(true);

      const userId = await getUserId();

      if (!userId) {
        router.replace("/");
        return;
      }

      const { response: fieldResponse, data: fieldData } = await apiRequest(
        `/fields?userId=${userId}`
      );

      const { response: cropResponse, data: cropData } = await apiRequest(
        `/crops?userId=${userId}`
      );

      if (!fieldResponse.ok) {
        throw new Error(fieldData.message || "Tarlalar alınamadı.");
      }

      if (!cropResponse.ok) {
        throw new Error(cropData.message || "Ürünler alınamadı.");
      }

      const fields = Array.isArray(fieldData) ? fieldData : [];
      const crops = Array.isArray(cropData) ? cropData : [];

      const selectedField = fields.find((item) => item._id === id);

      if (!selectedField) {
        throw new Error("Tarla bulunamadı.");
      }

      const selectedCrop = getCropForField(selectedField._id, crops);

      setField(selectedField);
      setCrop(selectedCrop || null);

      if (!selectedCrop) {
        setIrrigationMessage("Bu tarlada ürün olmadığı için sulama önerisi yok.");
        setAlertMessage("Bu tarlada ürün olmadığı için hava uyarısı yok.");
        setHarvestDate("-");
        setSeasonCalendar([]);
        return;
      }

      setHarvestDate(
        estimateHarvestDate(selectedCrop.sowingDate, selectedCrop.name)
      );

      const { response: irrigationResponse, data: irrigationData } =
        await apiRequest(
          `/recommendations/irrigation/${selectedField._id}?userId=${userId}`
        );

      if (irrigationResponse.ok) {
        setIrrigationMessage(irrigationData.message || "-");

        if (irrigationData.agronomy?.harvestDate) {
          setHarvestDate(formatDate(irrigationData.agronomy.harvestDate));
        }

        if (Array.isArray(irrigationData.agronomy?.seasonCalendar)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const futureCalendar = irrigationData.agronomy.seasonCalendar.filter(
            (item) => {
              const itemDate = new Date(item.date);
              itemDate.setHours(0, 0, 0, 0);
              return itemDate >= today;
            }
          );

          setSeasonCalendar(futureCalendar);
        }
      } else {
        setIrrigationMessage(
          irrigationData.message || "Sulama önerisi alınamadı."
        );
      }

      const { response: alertResponse, data: alertData } = await apiRequest(
        `/recommendations/alerts/${selectedField._id}?userId=${userId}`
      );

      if (alertResponse.ok) {
        setAlertMessage(alertData.message || "-");
      } else {
        setAlertMessage(alertData.message || "Hava uyarısı alınamadı.");
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCalendar() {
    try {
      if (!field) {
        throw new Error("Tarla bilgisi bulunamadı.");
      }

      if (!crop) {
        throw new Error("Önce bu tarlaya ürün eklemelisin.");
      }

      if (!seasonCalendar.length) {
        throw new Error("Takvime aktarılacak sezon planı bulunamadı.");
      }

      const createdCount = await addSeasonPlanToCalendar({
        fieldName: field.name,
        cropName: crop.name,
        seasonCalendar,
      });

      Alert.alert(
        "Başarılı",
        `${createdCount} adet sulama etkinliği telefon takvimine eklendi.`
      );
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  }

  async function handleClearCalendar() {
    try {
      const removed = await clearEkinayCalendar();

      if (removed) {
        Alert.alert("Başarılı", "Ekinay Takvimi ve tüm etkinlikleri silindi.");
      } else {
        Alert.alert("Bilgi", "Silinecek Ekinay Takvimi bulunamadı.");
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  }

  async function handleScheduleAlarms() {
    try {
      if (!field) {
        throw new Error("Tarla bilgisi bulunamadı.");
      }

      if (!crop) {
        throw new Error("Önce bu tarlaya ürün eklemelisin.");
      }

      if (!seasonCalendar.length) {
        throw new Error("Alarm kurulacak takvim verisi bulunamadı.");
      }

      const createdCount = await scheduleSeasonNotifications({
        fieldId: field._id,
        fieldName: field.name,
        cropName: crop.name,
        seasonCalendar,
      });

      Alert.alert(
        "Başarılı",
        `${createdCount} adet alarm planlandı.`
      );
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  }

  async function handleClearAlarms() {
    try {
      if (!field?._id) {
        throw new Error("Tarla bilgisi bulunamadı.");
      }

      const removedCount = await clearSeasonNotificationsForField(field._id);

      Alert.alert(
        "Başarılı",
        `${removedCount} adet alarm silindi.`
      );
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  }

  function getSeasonStatusStyle(irrigation) {
    if (irrigation === "Sulama gerekiyor") return styles.needWater;
    if (irrigation === "Kontrollü sulama") return styles.checkWater;
    return styles.noWater;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f6f3e" />
        <Text style={styles.loadingText}>Tarla detayı yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>{field?.name || "Tarla Detayı"}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tarla Bilgileri</Text>
        <Text style={styles.cardText}>Konum: {field?.location || "-"}</Text>
        <Text style={styles.cardText}>Alan: {field?.areaM2 || 0} m²</Text>
        <Text style={styles.cardText}>
          Tip: {field?.isGreenhouse ? "Sera" : "Açık Alan"}
        </Text>
        <Text style={styles.cardText}>
          Koordinat: {field?.latitude}, {field?.longitude}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ürün Bilgileri</Text>
        <Text style={styles.cardText}>
          Ürün: {crop ? crop.name : "Henüz ürün yok"}
        </Text>
        <Text style={styles.cardText}>
          Ekim Tarihi: {crop ? formatDate(crop.sowingDate) : "-"}
        </Text>
        <Text style={styles.cardText}>Tahmini Hasat: {harvestDate}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Bugünün Sulama Özeti</Text>
        <Text style={styles.infoText}>{irrigationMessage}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Hava Uyarısı</Text>
        <Text style={styles.infoText}>{alertMessage}</Text>
      </View>

      <Text style={styles.sectionTitle}>Bugünden Hasada Takvim</Text>

      {seasonCalendar.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Gösterilecek takvim verisi bulunamadı.
          </Text>
        </View>
      ) : (
        <View style={styles.monthsWrap}>
          {Object.entries(groupSeasonCalendarByMonth(seasonCalendar)).map(
            ([monthKey, items]) => {
              const firstDate = new Date(items[0].date);
              const monthTitle = firstDate.toLocaleDateString("tr-TR", {
                month: "long",
                year: "numeric",
              });

              const today = getTodayDateOnly();

              return (
                <View key={monthKey} style={styles.monthCard}>
                  <Text style={styles.monthTitle}>{monthTitle}</Text>

                  <View style={styles.mobileCalendarGrid}>
                    {items.map((item, index) => {
                      const itemDate = new Date(item.date);
                      itemDate.setHours(0, 0, 0, 0);

                      const isToday = itemDate.getTime() === today.getTime();

                      return (
                        <View
                          key={`${item.date}-${index}`}
                          style={[
                            styles.mobileCalendarDay,
                            getSeasonStatusStyle(item.irrigation),
                            isToday && styles.todayBox,
                          ]}
                        >
                          <Text style={styles.mobileCalendarDayNum}>
                            {new Date(item.date).getDate()}
                          </Text>
                          <Text style={styles.mobileCalendarStage}>
                            {item.stage}
                          </Text>
                          <Text style={styles.mobileCalendarStatus}>
                            {item.irrigation}
                          </Text>
                          {isToday ? (
                            <Text style={styles.todayLabel}>Bugün</Text>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            }
          )}
        </View>
      )}

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push(`/field-form?id=${field?._id}`)}
      >
        <Text style={styles.secondaryButtonText}>Bu Tarlayı Düzenle</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push(`/crop-form?fieldId=${field?._id}`)}
      >
        <Text style={styles.secondaryButtonText}>
          {crop ? "Ürünü Düzenle" : "Bu Tarlaya Ürün Ekle"}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleExportCalendar}>
        <Text style={styles.secondaryButtonText}>Takvime Aktar</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleClearCalendar}>
        <Text style={styles.secondaryButtonText}>Takvimden Tümünü Sil</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleScheduleAlarms}>
        <Text style={styles.secondaryButtonText}>Alarm Kur</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleClearAlarms}>
        <Text style={styles.secondaryButtonText}>Alarmları Temizle</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={loadFieldDetail}>
        <Text style={styles.primaryButtonText}>Bu Tarlayı Yenile</Text>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5ece1",
    marginBottom: 14,
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
    marginBottom: 4,
  },
  infoBox: {
    marginBottom: 14,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f4d2a",
    marginTop: 6,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5ece1",
    marginBottom: 18,
  },
  emptyText: {
    color: "#5b6b5f",
    fontSize: 15,
  },
  calendarItem: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  calendarDate: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 4,
  },
  calendarStage: {
    fontSize: 13,
    color: "#5b6b5f",
    marginBottom: 6,
  },
  calendarStatus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#234b2c",
  },
  needWater: {
    backgroundColor: "#fff1f1",
    borderColor: "#e3b3b3",
  },
  checkWater: {
    backgroundColor: "#fff8e7",
    borderColor: "#ecd58e",
  },
  noWater: {
    backgroundColor: "#eef7ee",
    borderColor: "#cfe2cf",
  },
  primaryButton: {
    backgroundColor: "#2f6f3e",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
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
    marginTop: 10,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#234b2c",
    textAlign: "center",
    fontWeight: "700",
  },

  monthsWrap: {
    marginBottom: 12,
  },
  monthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5ece1",
    marginBottom: 14,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 12,
    textTransform: "capitalize",
  },
  mobileCalendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mobileCalendarDay: {
    width: "31%",
    minHeight: 110,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },
  mobileCalendarDayNum: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 4,
  },
  mobileCalendarStage: {
    fontSize: 11,
    color: "#5b6b5f",
    marginBottom: 6,
  },
  mobileCalendarStatus: {
    fontSize: 11,
    fontWeight: "700",
    color: "#234b2c",
  },
  todayBox: {
    outlineWidth: 2,
    outlineColor: "#2f6f3e",
  },
  todayLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "700",
    color: "#2f6f3e",
  },
});