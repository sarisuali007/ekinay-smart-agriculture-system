import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "userId";

export async function saveUserId(userId) {
  await AsyncStorage.setItem(USER_ID_KEY, userId);
}

export async function getUserId() {
  return await AsyncStorage.getItem(USER_ID_KEY);
}

export async function removeUserId() {
  await AsyncStorage.removeItem(USER_ID_KEY);
}