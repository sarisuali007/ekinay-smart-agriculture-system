import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ekinay Mobile</Text>
      <Text style={styles.subtitle}>Mobil uygulama başlangıç ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f4d2a",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#5b6b5f",
    textAlign: "center",
  },
});