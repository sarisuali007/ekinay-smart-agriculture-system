import { Platform } from "react-native";
import * as Calendar from "expo-calendar";

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

export async function ensureEkinayCalendar() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Takvim izni verilmedi.");
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

  const existingCalendar = calendars.find(
    (calendar) => calendar.title === "Ekinay Takvimi"
  );

  if (existingCalendar) {
    return existingCalendar.id;
  }

  const calendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Ekinay Takvimi" };

  const calendarId = await Calendar.createCalendarAsync({
    title: "Ekinay Takvimi",
    color: "#2f6f3e",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: calendarSource.id,
    source: calendarSource,
    name: "Ekinay Takvimi",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  return calendarId;
}

export async function addSeasonPlanToCalendar({
  fieldName,
  cropName,
  seasonCalendar,
}) {
  const calendarId = await ensureEkinayCalendar();

  if (!Array.isArray(seasonCalendar) || !seasonCalendar.length) {
    throw new Error("Takvime aktarılacak veri bulunamadı.");
  }

  let createdCount = 0;

  for (const item of seasonCalendar) {
    if (
      item.irrigation !== "Sulama gerekiyor" &&
      item.irrigation !== "Kontrollü sulama"
    ) {
      continue;
    }

    const startDate = new Date(item.date);
    startDate.setHours(9, 0, 0, 0);

    const endDate = new Date(item.date);
    endDate.setHours(10, 0, 0, 0);

    const title =
      item.irrigation === "Sulama gerekiyor"
        ? `${fieldName} - Sulama`
        : `${fieldName} - Kontrollü Sulama`;

    const notes = [
      `Tarla: ${fieldName}`,
      `Ürün: ${cropName || "Belirtilmedi"}`,
      `Gelişim Evresi: ${item.stage || "-"}`,
      `Durum: ${item.irrigation}`,
      `Kaynak: Ekinay Mobile`,
    ].join("\n");

    await Calendar.createEventAsync(calendarId, {
      title,
      startDate,
      endDate,
      notes,
      timeZone: "Europe/Istanbul",
    });

    createdCount += 1;
  }

  return createdCount;
}