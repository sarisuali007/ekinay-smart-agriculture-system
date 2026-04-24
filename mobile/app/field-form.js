import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "../lib/api";
import { getUserId } from "../lib/auth";

function calculatePolygonCenter(points) {
  if (!points.length) return { latitude: 37.0, longitude: 35.0 };

  let totalLat = 0;
  let totalLng = 0;

  points.forEach((p) => {
    totalLat += p.latitude;
    totalLng += p.longitude;
  });

  return {
    latitude: totalLat / points.length,
    longitude: totalLng / points.length,
  };
}

function polygonToBackend(points) {
  return points.map((p) => ({
    lat: Number(p.latitude),
    lng: Number(p.longitude),
  }));
}

function backendToMapPoints(polygon) {
  if (!Array.isArray(polygon)) return [];
  return polygon.map((p) => ({
    latitude: Number(p.lat),
    longitude: Number(p.lng),
  }));
}

// Basit yaklaşık alan hesabı (m²)
function calculatePolygonArea(points) {
  if (!points || points.length < 3) return 0;

  const lat0 =
    points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
  const metersPerDegLat = 111320;
  const metersPerDegLng = 111320 * Math.cos((lat0 * Math.PI) / 180);

  const xy = points.map((p) => ({
    x: p.longitude * metersPerDegLng,
    y: p.latitude * metersPerDegLat,
  }));

  let area = 0;
  for (let i = 0; i < xy.length; i++) {
    const j = (i + 1) % xy.length;
    area += xy[i].x * xy[j].y;
    area -= xy[j].x * xy[i].y;
  }

  return Math.abs(area / 2);
}

export default function FieldFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fieldName, setFieldName] = useState("");
  const [fieldLocation, setFieldLocation] = useState("");
  const [isGreenhouse, setIsGreenhouse] = useState(false);

  const [points, setPoints] = useState([]);
  const [region, setRegion] = useState({
    latitude: 38.9637,
    longitude: 35.2433,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  const [fieldId, setFieldId] = useState("");
  const [userId, setUserId] = useState("");

  const areaM2 = useMemo(() => calculatePolygonArea(points), [points]);
  const center = useMemo(() => calculatePolygonCenter(points), [points]);

  useEffect(() => {
    loadForm();
  }, [id]);

  async function loadForm() {
    try {
      setLoading(true);

      const savedUserId = await getUserId();
      if (!savedUserId) {
        router.replace("/");
        return;
      }

      setUserId(savedUserId);

      if (id) {
        const { response, data } = await apiRequest(`/fields?userId=${savedUserId}`);

        if (!response.ok) {
          throw new Error(data.message || "Tarlalar alınamadı.");
        }

        const fields = Array.isArray(data) ? data : [];
        const existingField = fields.find((item) => item._id === id);

        if (!existingField) {
          throw new Error("Tarla bulunamadı.");
        }

        setFieldId(existingField._id);
        setFieldName(existingField.name || "");
        setFieldLocation(existingField.location || "");
        setIsGreenhouse(!!existingField.isGreenhouse);

        const mapPoints = backendToMapPoints(existingField.polygon || []);
        setPoints(mapPoints);

        if (mapPoints.length) {
          const mapCenter = calculatePolygonCenter(mapPoints);
          setRegion({
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
      } else {
        await goToCurrentLocation();
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function goToCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      const reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverse.length && !fieldLocation) {
        const place = reverse[0];
        const text = [place.city, place.district, place.region]
          .filter(Boolean)
          .join(" / ");
        if (text) setFieldLocation(text);
      }
    } catch {
      // burada sessiz geçiyoruz
    }
  }

  function handleMapPress(event) {
    const coordinate = event.nativeEvent.coordinate;
    setPoints((prev) => [...prev, coordinate]);
  }

  function handleUndoLastPoint() {
    setPoints((prev) => prev.slice(0, -1));
  }

  function handleClearPolygon() {
    setPoints([]);
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (!fieldName.trim()) {
        throw new Error("Tarla adı zorunludur.");
      }

      if (!fieldLocation.trim()) {
        throw new Error("Konum açıklaması zorunludur.");
      }

      if (points.length < 3) {
        throw new Error("Haritada en az 3 nokta seçmelisin.");
      }

      const payload = {
        userId,
        name: fieldName,
        location: fieldLocation,
        latitude: center.latitude,
        longitude: center.longitude,
        areaM2: Math.round(areaM2),
        isGreenhouse,
        polygon: polygonToBackend(points),
      };

      if (fieldId) {
        const { response, data } = await apiRequest(`/fields/${fieldId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(data.message || "Tarla güncellenemedi.");
        }
      } else {
        const { response, data } = await apiRequest("/fields", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(data.message || "Tarla eklenemedi.");
        }
      }

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      if (!fieldId) return;

      const { response, data } = await apiRequest(
        `/fields/${fieldId}?userId=${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(data.message || "Tarla silinemedi.");
      }

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f6f3e" />
        <Text style={styles.loadingText}>Tarla formu yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{fieldId ? "Tarlayı Düzenle" : "Yeni Tarla Ekle"}</Text>
      <Text style={styles.subtitle}>
        Haritaya dokunarak köşeleri seç. En az 3 nokta gerekli.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Tarla Adı"
        placeholderTextColor="#7a8a7e"
        value={fieldName}
        onChangeText={setFieldName}
      />

      <TextInput
        style={styles.input}
        placeholder="Konum Açıklaması"
        placeholderTextColor="#7a8a7e"
        value={fieldLocation}
        onChangeText={setFieldLocation}
      />

      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          region={region}
          onPress={handleMapPress}
        >
          {points.map((point, index) => (
            <Marker key={`${point.latitude}-${point.longitude}-${index}`} coordinate={point} />
          ))}

          {points.length >= 3 ? (
            <Polygon
              coordinates={points}
              strokeColor="#2f6f3e"
              fillColor="rgba(47,111,62,0.18)"
              strokeWidth={2}
            />
          ) : null}
        </MapView>
      </View>

      <Text style={styles.helperText}>Seçilen nokta sayısı: {points.length}</Text>
      <Text style={styles.helperText}>Alan: {Math.round(areaM2)} m²</Text>
      <Text style={styles.helperText}>
        Merkez: {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
      </Text>

      <View style={styles.actionRow}>
        <Pressable style={styles.smallButton} onPress={goToCurrentLocation}>
          <Text style={styles.smallButtonText}>Konumuma Git</Text>
        </Pressable>

        <Pressable style={styles.smallButton} onPress={handleUndoLastPoint}>
          <Text style={styles.smallButtonText}>Son Noktayı Sil</Text>
        </Pressable>

        <Pressable style={styles.smallButton} onPress={handleClearPolygon}>
          <Text style={styles.smallButtonText}>Temizle</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.toggleButton, isGreenhouse && styles.toggleButtonActive]}
        onPress={() => setIsGreenhouse((prev) => !prev)}
      >
        <Text
          style={[
            styles.toggleButtonText,
            isGreenhouse && styles.toggleButtonTextActive,
          ]}
        >
          {isGreenhouse ? "Bu tarla sera olarak işaretlendi" : "Bu tarla açık alan"}
        </Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.primaryButtonText}>
          {saving ? "Kaydediliyor..." : fieldId ? "Tarlayı Güncelle" : "Tarlayı Kaydet"}
        </Text>
      </Pressable>

      {fieldId ? (
        <Pressable style={styles.dangerButton} onPress={handleDelete}>
          <Text style={styles.dangerButtonText}>Tarlayı Sil</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
  },
  content: {
    padding: 20,
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
    fontSize: 28,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#5b6b5f",
    marginBottom: 18,
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
  mapWrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#dce8d8",
    marginTop: 6,
    marginBottom: 12,
  },
  map: {
    width: "100%",
    height: 320,
  },
  helperText: {
    color: "#4b5d4f",
    fontSize: 14,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  smallButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  smallButtonText: {
    color: "#234b2c",
    fontWeight: "700",
    fontSize: 13,
  },
  toggleButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8d8",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  toggleButtonActive: {
    backgroundColor: "#2f6f3e",
    borderColor: "#2f6f3e",
  },
  toggleButtonText: {
    color: "#234b2c",
    fontWeight: "700",
    textAlign: "center",
  },
  toggleButtonTextActive: {
    color: "#ffffff",
  },
  primaryButton: {
    backgroundColor: "#2f6f3e",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
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