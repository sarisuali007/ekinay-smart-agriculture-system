import * as Notifications from "expo-notifications";

const CHANNEL_ID = "ekinay-alarms";

async function ensurePermissions() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Bildirim izni verilmedi.");
  }
}

async function ensureAndroidChannel() {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Ekinay Alarmları",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
  });
}

function buildNotificationDate(dateString) {
  const date = new Date(dateString);
  date.setHours(8, 0, 0, 0);
  return date;
}

export async function scheduleSeasonNotifications({
  fieldId,
  fieldName,
  cropName,
  seasonCalendar,
}) {
  await ensurePermissions();
  await ensureAndroidChannel();

  if (!Array.isArray(seasonCalendar) || !seasonCalendar.length) {
    throw new Error("Alarm kurulacak takvim verisi bulunamadı.");
  }

  let createdCount = 0;

  for (const item of seasonCalendar) {
    if (
      item.irrigation !== "Sulama gerekiyor" &&
      item.irrigation !== "Kontrollü sulama"
    ) {
      continue;
    }

    const triggerDate = buildNotificationDate(item.date);

    if (triggerDate <= new Date()) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title:
          item.irrigation === "Sulama gerekiyor"
            ? `${fieldName} için sulama zamanı`
            : `${fieldName} için kontrollü sulama`,
        body: `${cropName || "Ürün"} - ${item.stage || "Gelişim evresi"} - ${item.irrigation}`,
        data: {
          source: "ekinay",
          type: "season_alarm",
          fieldId,
          date: item.date,
        },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: CHANNEL_ID,
      },
    });

    createdCount += 1;
  }

  return createdCount;
}

export async function clearSeasonNotificationsForField(fieldId) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  let removedCount = 0;

  for (const item of scheduled) {
    if (
      item?.content?.data?.source === "ekinay" &&
      item?.content?.data?.type === "season_alarm" &&
      item?.content?.data?.fieldId === fieldId
    ) {
      await Notifications.cancelScheduledNotificationAsync(item.identifier);
      removedCount += 1;
    }
  }

  return removedCount;
}