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
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId } from "../lib/auth";

export default function CropFormScreen() {
  const router = useRouter();
  const { fieldId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [field, setField] = useState(null);
  const [existingCrop, setExistingCrop] = useState(null);

  const [cropName, setCropName] = useState("");
  const [sowingDate, setSowingDate] = useState("");

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
        setSowingDate(
          selectedCrop.sowingDate
            ? new Date(selectedCrop.sowingDate).toISOString().split("T")[0]
            : ""
        );
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const userId = await getUserId();
      if (!userId) {
        router.replace("/");
        return;
      }

      if (!cropName || !sowingDate) {
        throw new Error("Ürün adı ve ekim tarihi zorunludur.");
      }

      if (existingCrop) {
        const { response, data } = await apiRequest(`/crops/${existingCrop._id}`, {
          method: "PUT",
          body: JSON.stringify({
            userId,
            name: cropName,
            fieldId,
            sowingDate,
          }),
        });

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
            sowingDate,
          }),
        });

        if (!response.ok) {
          throw new Error(data.message || "Ürün eklenemedi.");
        }
      }

      router.replace(`/field-detail?id=${fieldId}`);
    } catch (error) {
      Alert.alert("Hata", error.message);
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
      Alert.alert("Hata", error.message);
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
    <View style={styles.container}>
      <Text style={styles.title}>
        {existingCrop ? "Ürünü Düzenle" : "Ürün Ekle"}
      </Text>

      <Text style={styles.subtitle}>
        {field ? `${field.name} tarlası için işlem yapıyorsun.` : "Tarla yükleniyor..."}
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
        placeholder="YYYY-AA-GG"
        placeholderTextColor="#7a8a7e"
        value={sowingDate}
        onChangeText={setSowingDate}
      />

      <Pressable style={styles.primaryButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.primaryButtonText}>
          {saving ? "Kaydediliyor..." : existingCrop ? "Ürünü Güncelle" : "Ürünü Ekle"}
        </Text>
      </Pressable>

      {existingCrop ? (
        <Pressable style={styles.dangerButton} onPress={handleDelete}>
          <Text style={styles.dangerButtonText}>Ürünü Sil</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
    padding: 24,
    justifyContent: "center",
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
    gap: 10,
    marginBottom: 18,
  },
  cropOption: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
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
    marginBottom: 14,
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