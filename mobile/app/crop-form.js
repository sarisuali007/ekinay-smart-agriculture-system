import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId } from "../lib/auth";

const CROP_PROFILES = {
  domates: {
    label: "Domates",
    daysToHarvest: 70,
  },
  biber: {
    label: "Biber",
    daysToHarvest: 78,
  },
  salatalık: {
    label: "Salatalık",
    daysToHarvest: 55,
  },
  fasulye: {
    label: "Fasulye",
    daysToHarvest: 55,
  },
};

function pad2(value) {
  return String(value).padStart(2, "0");
}

function getTodayDateOnly() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatDateForInput(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}`;
}

function formatDateForDisplay(date) {
  if (!date || isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function parseDateInput(value) {
  const trimmed = String(value || "").trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return valid ? date : null;
}

function normalizeDateInput(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 8);

  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function addDays(date, dayCount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + dayCount);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function calculateHarvestDate(sowingDate, cropName) {
  const profile = CROP_PROFILES[cropName];

  if (!profile || !sowingDate) return null;

  return addDays(sowingDate, profile.daysToHarvest);
}

function getDayDiff(startDate, endDate) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((endDate.getTime() - startDate.getTime()) / dayMs);
}

export default function CropFormScreen() {
  const router = useRouter();
  const { fieldId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [field, setField] = useState(null);
  const [existingCrop, setExistingCrop] = useState(null);

  const [cropName, setCropName] = useState("");
  const [sowingDate, setSowingDate] = useState("");

  const parsedSowingDate = useMemo(
    () => parseDateInput(sowingDate),
    [sowingDate]
  );

  const harvestDate = useMemo(
    () => calculateHarvestDate(parsedSowingDate, cropName),
    [parsedSowingDate, cropName]
  );

  const calendarStatus = useMemo(() => {
    if (!cropName) {
      return {
        type: "info",
        message: "Önce ürün seç. Sonra ekim tarihine göre hasat takvimi hesaplanır.",
      };
    }

    if (!sowingDate) {
      return {
        type: "info",
        message: "Tarihi 2026-05-16 gibi yazabilirsin. Kısa çizgileri otomatik ekliyoruz.",
      };
    }

    if (!parsedSowingDate) {
      return {
        type: "error",
        message: "Tarih geçerli değil. Örnek doğru format: 2026-05-16",
      };
    }

    if (!harvestDate) {
      return {
        type: "error",
        message: "Hasat tarihi hesaplanamadı.",
      };
    }

    const today = getTodayDateOnly();
    const remainingDays = getDayDiff(today, harvestDate);

    if (remainingDays < 0) {
      return {
        type: "error",
        message: `Bu tarih çok eski. Tahmini hasat ${formatDateForDisplay(
          harvestDate
        )} tarihinde bitmiş. Takvim için daha güncel bir ekim tarihi seç.`,
      };
    }

    return {
      type: "success",
      message: `Tahmini hasat: ${formatDateForDisplay(
        harvestDate
      )}. Bugünden hasada kadar yaklaşık ${remainingDays + 1} günlük takvim gösterilecek.`,
    };
  }, [cropName, sowingDate, parsedSowingDate, harvestDate]);

  useEffect(() => {
    loadForm();
  }, [fieldId]);

  async function loadForm() {
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

      const selectedField = fields.find((item) => item._id === fieldId);
      if (!selectedField) {
        throw new Error("Tarla bulunamadı.");
      }

      const selectedCrop = crops.find((crop) => {
        const cropFieldId =
          typeof crop.fieldId === "object" ? crop.fieldId._id : crop.fieldId;
        return cropFieldId === fieldId;
      });

      setField(selectedField);
      setExistingCrop(selectedCrop || null);

      if (selectedCrop) {
        setCropName(selectedCrop.name || "");

        if (selectedCrop.sowingDate) {
          const existingDate = new Date(selectedCrop.sowingDate);
          if (!isNaN(existingDate.getTime())) {
            setSowingDate(formatDateForInput(existingDate));
          }
        }
      }
    } catch (error) {
      Alert.alert("Hata", error.message || "Ürün formu yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(value) {
    setSowingDate(normalizeDateInput(value));
  }

  function setTodayDate() {
    setSowingDate(formatDateForInput(getTodayDateOnly()));
  }

  function setDateByRemainingHarvestDays(remainingHarvestDays) {
    if (!cropName) {
      Alert.alert("Bilgi", "Önce ürün seçmelisin.");
      return;
    }

    const profile = CROP_PROFILES[cropName];
    const today = getTodayDateOnly();

    const passedDays = Math.max(
      0,
      profile.daysToHarvest - remainingHarvestDays
    );

    const suggestedSowingDate = addDays(today, -passedDays);
    setSowingDate(formatDateForInput(suggestedSowingDate));
  }

  function setOneWeekAgo() {
    const today = getTodayDateOnly();
    setSowingDate(formatDateForInput(addDays(today, -7)));
  }

  function setOneMonthAgo() {
    const today = getTodayDateOnly();
    setSowingDate(formatDateForInput(addDays(today, -30)));
  }

  async function handleSave() {
    try {
      setSaving(true);

      const userId = await getUserId();
      if (!userId) {
        router.replace("/");
        return;
      }

      if (!cropName) {
        throw new Error("Ürün seçmelisin.");
      }

      if (!sowingDate) {
        throw new Error("Ekim tarihi zorunludur.");
      }

      if (!parsedSowingDate) {
        throw new Error("Ekim tarihi geçerli değil. Örnek: 2026-05-16");
      }

      const calculatedHarvestDate = calculateHarvestDate(
        parsedSowingDate,
        cropName
      );

      if (!calculatedHarvestDate) {
        throw new Error("Hasat tarihi hesaplanamadı.");
      }

      const today = getTodayDateOnly();

      if (calculatedHarvestDate < today) {
        throw new Error(
          `Bu ekim tarihiyle tahmini hasat ${formatDateForDisplay(
            calculatedHarvestDate
          )} tarihinde bitmiş görünüyor. Takvim çıkması için daha güncel bir ekim tarihi seç.`
        );
      }

      const normalizedSowingDate = formatDateForInput(parsedSowingDate);

      if (existingCrop) {
        const { response, data } = await apiRequest(
          `/crops/${existingCrop._id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              userId,
              name: cropName,
              fieldId,
              sowingDate: normalizedSowingDate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(data.message || "Ürün güncellenemedi.");
        }
      } else {
        const { response, data } = await apiRequest("/crops", {
          method: "POST",
          body: JSON.stringify({
            userId,
            name: cropName,
            fieldId,
            sowingDate: normalizedSowingDate,
          }),
        });

        if (!response.ok) {
          throw new Error(data.message || "Ürün eklenemedi.");
        }
      }

      router.replace(`/field-detail?id=${fieldId}`);
    } catch (error) {
      Alert.alert("Hata", error.message || "Ürün kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      if (!existingCrop) return;

      const userId = await getUserId();
      if (!userId) {
        router.replace("/");
        return;
      }

      const { response, data } = await apiRequest(
        `/crops/${existingCrop._id}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(data.message || "Ürün silinemedi.");
      }

      router.replace(`/field-detail?id=${fieldId}`);
    } catch (error) {
      Alert.alert("Hata", error.message || "Ürün silinemedi.");
    }
  }

  function renderCropOption(value, label) {
    const selected = cropName === value;

    return (
      <Pressable
        key={value}
        style={[styles.cropOption, selected && styles.cropOptionSelected]}
        onPress={() => setCropName(value)}
      >
        <Text
          style={[
            styles.cropOptionText,
            selected && styles.cropOptionTextSelected,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f6f3e" />
        <Text style={styles.loadingText}>Ürün formu yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {existingCrop ? "Ürünü Düzenle" : "Ürün Ekle"}
        </Text>

        <Text style={styles.subtitle}>
          {field
            ? `${field.name} tarlası için ürün ve ekim tarihi seç.`
            : "Tarla yükleniyor..."}
        </Text>

        <Text style={styles.label}>Ürün Seç</Text>
        <View style={styles.cropGrid}>
          {renderCropOption("domates", "Domates")}
          {renderCropOption("biber", "Biber")}
          {renderCropOption("salatalık", "Salatalık")}
          {renderCropOption("fasulye", "Fasulye")}
        </View>

        <Text style={styles.label}>Ekim Tarihi</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-05-16"
          placeholderTextColor="#7a8a7e"
          value={sowingDate}
          onChangeText={handleDateChange}
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
        />

        <Text style={styles.helperText}>
          Sadece rakam yazabilirsin. Örneğin 20260516 yazınca otomatik
          2026-05-16 olur.
        </Text>

        <View style={styles.quickDateGrid}>
          <Pressable style={styles.quickDateButton} onPress={setTodayDate}>
            <Text style={styles.quickDateText}>Bugün</Text>
          </Pressable>

          <Pressable style={styles.quickDateButton} onPress={setOneWeekAgo}>
            <Text style={styles.quickDateText}>1 Hafta Önce</Text>
          </Pressable>

          <Pressable style={styles.quickDateButton} onPress={setOneMonthAgo}>
            <Text style={styles.quickDateText}>1 Ay Önce</Text>
          </Pressable>

          <Pressable
            style={styles.quickDateButton}
            onPress={() => setDateByRemainingHarvestDays(30)}
          >
            <Text style={styles.quickDateText}>Hasada 30 Gün</Text>
          </Pressable>

          <Pressable
            style={styles.quickDateButton}
            onPress={() => setDateByRemainingHarvestDays(7)}
          >
            <Text style={styles.quickDateText}>Hasada 7 Gün</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.previewBox,
            calendarStatus.type === "error" && styles.previewBoxError,
            calendarStatus.type === "success" && styles.previewBoxSuccess,
          ]}
        >
          <Text style={styles.previewTitle}>Takvim Kontrolü</Text>
          <Text style={styles.previewText}>{calendarStatus.message}</Text>

          {cropName ? (
            <Text style={styles.previewText}>
              Seçilen ürün: {CROP_PROFILES[cropName]?.label} / Ortalama hasat:
              {" "}
              {CROP_PROFILES[cropName]?.daysToHarvest} gün
            </Text>
          ) : null}
        </View>

        <Pressable
          style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving
              ? "Kaydediliyor..."
              : existingCrop
              ? "Ürünü Güncelle"
              : "Ürünü Ekle"}
          </Text>
        </Pressable>

        {existingCrop ? (
          <Pressable style={styles.dangerButton} onPress={handleDelete}>
            <Text style={styles.dangerButtonText}>Ürünü Sil</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={styles.backButton}
          onPress={() => router.replace(`/field-detail?id=${fieldId}`)}
        >
          <Text style={styles.backButtonText}>Tarla Detayına Dön</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f2",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
  },
  content: {
    padding: 24,
    paddingBottom: 90,
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
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#234b2c",
    marginBottom: 10,
    marginTop: 6,
  },
  cropGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  cropOption: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  cropOptionSelected: {
    backgroundColor: "#2f6f3e",
    borderColor: "#2f6f3e",
  },
  cropOptionText: {
    color: "#234b2c",
    fontWeight: "700",
  },
  cropOptionTextSelected: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
    color: "#1f2937",
    fontSize: 16,
  },
  helperText: {
    color: "#5b6b5f",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  quickDateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  quickDateButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  quickDateText: {
    color: "#234b2c",
    fontWeight: "700",
    fontSize: 13,
  },
  previewBox: {
    backgroundColor: "#f7faf6",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  previewBoxError: {
    backgroundColor: "#fff1f1",
    borderColor: "#e3b3b3",
  },
  previewBoxSuccess: {
    backgroundColor: "#eef7ee",
    borderColor: "#cfe2cf",
  },
  previewTitle: {
    color: "#234b2c",
    fontWeight: "700",
    marginBottom: 8,
  },
  previewText: {
    color: "#4b5d4f",
    lineHeight: 21,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: "#2f6f3e",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
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
  backButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  backButtonText: {
    color: "#234b2c",
    fontSize: 16,
    fontWeight: "700",
  },
});