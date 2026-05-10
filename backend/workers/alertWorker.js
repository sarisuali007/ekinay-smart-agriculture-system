require("dotenv").config();

const { consumeAlertMessages } = require("../services/rabbitmqService");
const { sendExpoPush } = require("../services/pushService");

async function startWorker() {
    console.log("Ekinay RabbitMQ Alert Worker başlatılıyor...");

    await consumeAlertMessages(async (message) => {
        const expoPushToken = message.expoPushToken;

        if (!expoPushToken) {
            throw new Error("Expo push token bulunamadı.");
        }

        const expoResponse = await sendExpoPush(expoPushToken, {
            title: message.title,
            body: message.body,
            data: message.data
        });

        console.log("Expo push cevabı:", JSON.stringify(expoResponse));

        if (expoResponse?.data?.status === "error") {
            throw new Error(expoResponse.data.message || "Expo push gönderilemedi.");
        }
    });
}

startWorker().catch((error) => {
    console.error("RabbitMQ worker başlatılamadı:", error.message);
    process.exit(1);
});